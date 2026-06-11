"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { getUserRecord, UserRecord } from "@/lib/authHelpers";
import {
  generateInvoicePDF,
  generateContractPDF,
  AgencySettings,
  InvoiceData,
  ContractData,
} from "@/lib/pdfGenerator";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  KeyRound,
  LogOut,
  FileText,
  CheckCircle,
  Clock,
  Download,
  PenLine,
  X,
  Shield,
  Briefcase,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ClientRecord {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  projectName?: string;
  projectStatus?: string;
  uid?: string;
  notes?: string;
}

interface InvoiceDoc extends InvoiceData {
  id: string;
  clientId: string;
  status: "Draft" | "Sent" | "Paid";
  createdAt?: unknown;
}

interface ContractDoc extends ContractData {
  id: string;
  clientId: string;
  contractNumber: string;
  status: "Draft" | "Sent" | "Signed";
  createdAt?: unknown;
}

// ── Status config ──────────────────────────────────────────────────────────────

const PROJECT_STAGES = [
  "Inquiry",
  "Proposal Sent",
  "Contract Signed",
  "In Progress",
  "Review",
  "Delivered",
] as const;

function getStatusStyle(status: string): { bg: string; text: string; dot: string } {
  const map: Record<string, { bg: string; text: string; dot: string }> = {
    Inquiry:           { bg: "bg-gray-500/15",   text: "text-gray-400",   dot: "bg-gray-400"   },
    "Proposal Sent":   { bg: "bg-blue-500/15",   text: "text-blue-400",   dot: "bg-blue-400"   },
    "Contract Signed": { bg: "bg-purple-500/15", text: "text-purple-400", dot: "bg-purple-400" },
    "In Progress":     { bg: "bg-orange-500/15", text: "text-orange-400", dot: "bg-orange-400" },
    Review:            { bg: "bg-yellow-500/15", text: "text-yellow-400", dot: "bg-yellow-400" },
    Delivered:         { bg: "bg-teal-500/15",   text: "text-teal-400",   dot: "bg-teal-400"   },
    Completed:         { bg: "bg-green-500/15",  text: "text-green-400",  dot: "bg-green-400"  },
  };
  return map[status] ?? { bg: "bg-gray-500/15", text: "text-gray-400", dot: "bg-gray-400" };
}

function getInvoiceStatusStyle(status: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    Draft: { bg: "bg-gray-500/15", text: "text-gray-400" },
    Sent:  { bg: "bg-blue-500/15", text: "text-blue-400" },
    Paid:  { bg: "bg-green-500/15",text: "text-green-400" },
  };
  return map[status] ?? { bg: "bg-gray-500/15", text: "text-gray-400" };
}

function getContractStatusStyle(status: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    Draft:  { bg: "bg-gray-500/15",   text: "text-gray-400"   },
    Sent:   { bg: "bg-blue-500/15",   text: "text-blue-400"   },
    Signed: { bg: "bg-green-500/15",  text: "text-green-400"  },
  };
  return map[status] ?? { bg: "bg-gray-500/15", text: "text-gray-400" };
}

const CURRENCY_SYMBOLS: Record<string, string> = { INR: "₹", USD: "$" };

function formatAmount(amount: number, currency: string): string {
  const sym = CURRENCY_SYMBOLS[currency] || currency;
  if (currency === "INR") {
    return `${sym}${amount.toLocaleString("en-IN", { minimumFractionDigits: 0 })}`;
  }
  return `${sym}${amount.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}

function calcInvoiceTotal(inv: InvoiceDoc): number {
  const subtotal = (inv.items || []).reduce((s, i) => s + i.quantity * i.rate, 0);
  const tax = inv.taxPercent ? subtotal * (inv.taxPercent / 100) : 0;
  return subtotal + tax;
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function ClientPortalPage() {
  // ── Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [userRecord, setUserRecord] = useState<UserRecord | null>(null);

  // ── Login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // ── Data
  const [clientRecord, setClientRecord] = useState<ClientRecord | null>(null);
  const [invoices, setInvoices] = useState<InvoiceDoc[]>([]);
  const [contracts, setContracts] = useState<ContractDoc[]>([]);
  const [agencySettings, setAgencySettings] = useState<AgencySettings>({});
  const [dataLoading, setDataLoading] = useState(false);

  // ── Contract signing modal
  const [signingContract, setSigningContract] = useState<ContractDoc | null>(null);
  const [signerName, setSignerName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [signingLoading, setSigningLoading] = useState(false);

  // ── PDF download loading states
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null);

  // ── Auth state listener ────────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const record = await getUserRecord(user.uid);
          if (record && record.role === "client") {
            setUserRecord(record);
            setIsLoggedIn(true);
            if (record.clientId) {
              await fetchClientData(user.uid, record.clientId);
            }
          } else {
            // Not a client — sign out
            await signOut(auth);
            setLoginError("Access denied. This portal is for clients only.");
            setIsLoggedIn(false);
            setUserRecord(null);
          }
        } catch {
          await signOut(auth);
          setIsLoggedIn(false);
          setUserRecord(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserRecord(null);
        setClientRecord(null);
        setInvoices([]);
        setContracts([]);
        setAgencySettings({});
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fetch all client data ──────────────────────────────────────────────────
  const fetchClientData = async (uid: string, clientId: string) => {
    setDataLoading(true);
    try {
      // 1. Client record
      const clientSnap = await getDoc(doc(db, "clients", clientId));
      if (clientSnap.exists()) {
        setClientRecord(clientSnap.data() as ClientRecord);
      }

      // 2. Invoices
      const invQuery = query(collection(db, "invoices"), where("clientId", "==", clientId));
      const invSnap = await getDocs(invQuery);
      const invDocs: InvoiceDoc[] = invSnap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<InvoiceDoc, "id">),
      }));
      // Sort by date desc (newest first)
      invDocs.sort((a, b) => (a.date < b.date ? 1 : -1));
      setInvoices(invDocs);

      // 3. Contracts
      const conQuery = query(collection(db, "contracts"), where("clientId", "==", clientId));
      const conSnap = await getDocs(conQuery);
      const conDocs: ContractDoc[] = conSnap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<ContractDoc, "id">),
      }));
      conDocs.sort((a, b) => (a.date < b.date ? 1 : -1));
      setContracts(conDocs);

      // 4. Agency settings
      const settingsSnap = await getDoc(doc(db, "settings", "main"));
      if (settingsSnap.exists()) {
        setAgencySettings(settingsSnap.data() as AgencySettings);
      }
    } catch (err) {
      console.error("Error fetching client data:", err);
    } finally {
      setDataLoading(false);
    }
  };

  // ── Login handler ──────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const record = await getUserRecord(cred.user.uid);
      if (!record || record.role !== "client") {
        await signOut(auth);
        setLoginError("Access denied. This portal is for clients only.");
      }
      // onAuthStateChanged handles the rest
    } catch {
      setLoginError("Invalid email or password. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await signOut(auth);
  };

  // ── Contract signing ───────────────────────────────────────────────────────
  const openSigningModal = (contract: ContractDoc) => {
    setSigningContract(contract);
    setSignerName("");
    setAgreedToTerms(false);
  };

  const closeSigningModal = () => {
    setSigningContract(null);
    setSignerName("");
    setAgreedToTerms(false);
  };

  const handleSignContract = async () => {
    if (!signingContract || !signerName.trim() || !agreedToTerms) return;
    setSigningLoading(true);
    try {
      await updateDoc(doc(db, "contracts", signingContract.id), {
        signedByClient: true,
        clientSignatureName: signerName.trim(),
        signedAt: new Date().toLocaleDateString(),
        status: "Signed",
      });
      // Refetch
      if (userRecord?.clientId) {
        await fetchClientData(userRecord.uid, userRecord.clientId);
      }
      closeSigningModal();
    } catch (err) {
      console.error("Error signing contract:", err);
    } finally {
      setSigningLoading(false);
    }
  };

  // ── PDF Downloads ──────────────────────────────────────────────────────────
  const handleDownloadInvoice = async (inv: InvoiceDoc) => {
    setDownloadingPdf(`inv-${inv.id}`);
    try {
      await generateInvoicePDF(inv, agencySettings);
    } catch (err) {
      console.error("Error generating invoice PDF:", err);
    } finally {
      setDownloadingPdf(null);
    }
  };

  const handleDownloadContract = async (con: ContractDoc) => {
    setDownloadingPdf(`con-${con.id}`);
    try {
      await generateContractPDF(con, agencySettings);
    } catch (err) {
      console.error("Error generating contract PDF:", err);
    } finally {
      setDownloadingPdf(null);
    }
  };

  // ── Stepper helper ─────────────────────────────────────────────────────────
  const getStepperStageIndex = (status: string): number => {
    const map: Record<string, number> = {
      Inquiry: 0,
      "Proposal Sent": 1,
      "Contract Signed": 2,
      "In Progress": 3,
      Review: 4,
      Delivered: 5,
      Completed: 5,
    };
    return map[status] ?? 0;
  };

  // ── Auth loading splash ────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#A0A0A0]">Loading portal…</p>
        </div>
      </main>
    );
  }

  // ── Login Screen ───────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#050505] text-[#F5F5F5] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF6B00]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md bg-[#111111] border border-white/[0.08] rounded-2xl p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00] mx-auto mb-5">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Client Portal</h1>
            <p className="text-sm text-[#A0A0A0] mt-2">
              Sign in to access your project dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#FF6B00]/50 focus:outline-none transition-colors placeholder-white/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#FF6B00]/50 focus:outline-none transition-colors placeholder-white/20"
              />
            </div>

            {loginError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-lg text-center">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-[#FF6B00]/10 flex items-center justify-center gap-2 mt-2"
            >
              {loginLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing In…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[#555555] mt-6">
            Optify360 Client Portal · Secure Access
          </p>
        </div>
      </main>
    );
  }

  // ── Dashboard (logged in) ──────────────────────────────────────────────────
  const currentStatus = clientRecord?.projectStatus || "Inquiry";
  const currentStepIndex = getStepperStageIndex(currentStatus);
  const statusStyle = getStatusStyle(currentStatus);

  return (
    <main className="min-h-screen bg-[#050505] text-[#F5F5F5]">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          {/* Logo + Label */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl font-bold text-[#FF6B00] tracking-tight shrink-0">
              Optify360
            </span>
            <span className="hidden sm:block h-4 w-px bg-white/20" />
            <span className="hidden sm:block text-xs font-semibold uppercase tracking-widest text-[#A0A0A0]">
              Client Portal
            </span>
          </div>

          {/* User info + logout */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="hidden sm:block text-xs text-[#555555] truncate max-w-[180px]">
              {userRecord?.email}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 px-3 py-2 rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-16">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back,{" "}
            <span className="text-[#FF6B00]">{clientRecord?.name || "Client"}</span>!
          </h1>
          <p className="text-sm text-[#A0A0A0] mt-1">
            Here&apos;s an overview of your project and documents.
          </p>
        </div>

        {/* Data loading spinner */}
        {dataLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-9 h-9 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[#A0A0A0]">Loading your data…</p>
            </div>
          </div>
        )}

        {!dataLoading && (
          <>
            {/* ── A. Project Status Card ── */}
            <section>
              <div className="bg-[#111111] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
                <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-4 h-4 text-[#FF6B00]" />
                      <span className="text-xs font-semibold uppercase tracking-widest text-[#FF6B00]">
                        Active Project
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                      {clientRecord?.projectName || "Your Project"}
                    </h2>
                    {clientRecord?.company && (
                      <p className="text-sm text-[#A0A0A0] mt-1">{clientRecord.company}</p>
                    )}
                  </div>

                  {/* Status badge */}
                  <span
                    className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
                    {currentStatus}
                  </span>
                </div>

                {/* Progress Stepper */}
                <div className="relative">
                  {/* Connector line */}
                  <div className="absolute top-4 left-4 right-4 h-px bg-white/[0.07] z-0" />
                  <div
                    className="absolute top-4 left-4 h-px bg-[#FF6B00]/50 z-0 transition-all duration-700"
                    style={{
                      width:
                        currentStepIndex === 0
                          ? "0%"
                          : `${(currentStepIndex / (PROJECT_STAGES.length - 1)) * 100}%`,
                    }}
                  />

                  <div className="relative z-10 flex justify-between">
                    {PROJECT_STAGES.map((stage, idx) => {
                      const isCompleted = idx < currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      return (
                        <div key={stage} className="flex flex-col items-center gap-2 flex-1">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-bold transition-all duration-300 ${
                              isCompleted
                                ? "bg-[#FF6B00] border-[#FF6B00] text-white"
                                : isCurrent
                                ? "bg-[#FF6B00]/20 border-[#FF6B00] text-[#FF6B00]"
                                : "bg-[#111111] border-white/10 text-[#444444]"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>
                          <span
                            className={`text-center text-[10px] leading-tight font-medium hidden sm:block ${
                              isCurrent
                                ? "text-[#FF6B00]"
                                : isCompleted
                                ? "text-[#777777]"
                                : "text-[#333333]"
                            }`}
                          >
                            {stage === "Proposal Sent"
                              ? "Proposal"
                              : stage === "Contract Signed"
                              ? "Contract"
                              : stage === "In Progress"
                              ? "Development"
                              : stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile stage label */}
                <p className="sm:hidden text-xs text-[#A0A0A0] text-center mt-4">
                  Stage {currentStepIndex + 1} of {PROJECT_STAGES.length}:{" "}
                  <span className="text-[#FF6B00] font-semibold">{currentStatus}</span>
                </p>
              </div>
            </section>

            {/* ── B. Invoices Section ── */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-[#FF6B00]" />
                <h2 className="text-lg font-bold">Your Invoices</h2>
                <span className="text-xs font-semibold text-[#A0A0A0] bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 rounded-full">
                  {invoices.length}
                </span>
              </div>

              {invoices.length === 0 ? (
                <div className="bg-[#111111] border border-white/[0.08] rounded-2xl p-10 text-center">
                  <FileText className="w-10 h-10 text-[#333333] mx-auto mb-3" />
                  <p className="text-[#555555] text-sm">No invoices have been issued yet.</p>
                  <p className="text-[#333333] text-xs mt-1">
                    Your invoices will appear here once created.
                  </p>
                </div>
              ) : (
                <div className="bg-[#111111] border border-white/[0.08] rounded-2xl overflow-hidden">
                  {/* Desktop table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/[0.06]">
                          <th className="text-left text-xs font-semibold uppercase tracking-wider text-[#555555] px-6 py-4">
                            Invoice #
                          </th>
                          <th className="text-left text-xs font-semibold uppercase tracking-wider text-[#555555] px-4 py-4">
                            Date
                          </th>
                          <th className="text-left text-xs font-semibold uppercase tracking-wider text-[#555555] px-4 py-4">
                            Due Date
                          </th>
                          <th className="text-right text-xs font-semibold uppercase tracking-wider text-[#555555] px-4 py-4">
                            Amount
                          </th>
                          <th className="text-center text-xs font-semibold uppercase tracking-wider text-[#555555] px-4 py-4">
                            Status
                          </th>
                          <th className="text-right text-xs font-semibold uppercase tracking-wider text-[#555555] px-6 py-4">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map((inv, idx) => {
                          const invStatus = getInvoiceStatusStyle(inv.status);
                          const total = calcInvoiceTotal(inv);
                          const isDownloading = downloadingPdf === `inv-${inv.id}`;
                          return (
                            <tr
                              key={inv.id}
                              className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${
                                idx === invoices.length - 1 ? "border-b-0" : ""
                              }`}
                            >
                              <td className="px-6 py-4 font-mono text-xs text-[#FF6B00] font-semibold">
                                #{inv.invoiceNumber}
                              </td>
                              <td className="px-4 py-4 text-[#A0A0A0] text-xs">{inv.date}</td>
                              <td className="px-4 py-4 text-[#A0A0A0] text-xs">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {inv.dueDate}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-right font-semibold text-sm">
                                {formatAmount(total, inv.currency)}
                              </td>
                              <td className="px-4 py-4 text-center">
                                <span
                                  className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${invStatus.bg} ${invStatus.text}`}
                                >
                                  {inv.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => handleDownloadInvoice(inv)}
                                  disabled={isDownloading}
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/20 hover:bg-[#FF6B00]/20 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                  {isDownloading ? (
                                    <div className="w-3 h-3 border border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Download className="w-3 h-3" />
                                  )}
                                  PDF
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="sm:hidden divide-y divide-white/[0.05]">
                    {invoices.map((inv) => {
                      const invStatus = getInvoiceStatusStyle(inv.status);
                      const total = calcInvoiceTotal(inv);
                      const isDownloading = downloadingPdf === `inv-${inv.id}`;
                      return (
                        <div key={inv.id} className="p-4 flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-[#FF6B00] font-semibold">
                              #{inv.invoiceNumber}
                            </span>
                            <span
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${invStatus.bg} ${invStatus.text}`}
                            >
                              {inv.status}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-[#A0A0A0]">
                            <span>Date: {inv.date}</span>
                            <span>Due: {inv.dueDate}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">{formatAmount(total, inv.currency)}</span>
                            <button
                              onClick={() => handleDownloadInvoice(inv)}
                              disabled={isDownloading}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/20 hover:bg-[#FF6B00]/20 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              {isDownloading ? (
                                <div className="w-3 h-3 border border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Download className="w-3 h-3" />
                              )}
                              Download PDF
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>

            {/* ── C. Contracts Section ── */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-[#FF6B00]" />
                <h2 className="text-lg font-bold">Your Contracts</h2>
                <span className="text-xs font-semibold text-[#A0A0A0] bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 rounded-full">
                  {contracts.length}
                </span>
              </div>

              {contracts.length === 0 ? (
                <div className="bg-[#111111] border border-white/[0.08] rounded-2xl p-10 text-center">
                  <Shield className="w-10 h-10 text-[#333333] mx-auto mb-3" />
                  <p className="text-[#555555] text-sm">No contracts have been issued yet.</p>
                  <p className="text-[#333333] text-xs mt-1">
                    Your service agreements will appear here once created.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contracts.map((con) => {
                    const conStatus = getContractStatusStyle(con.status);
                    const isSigned = con.status === "Signed" || con.signedByClient;
                    const isDownloading = downloadingPdf === `con-${con.id}`;
                    return (
                      <div
                        key={con.id}
                        className="bg-[#111111] border border-white/[0.08] rounded-2xl p-5 sm:p-6"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          {/* Contract info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="font-mono text-xs text-[#FF6B00] font-semibold">
                                #{con.contractNumber}
                              </span>
                              <span
                                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${conStatus.bg} ${conStatus.text}`}
                              >
                                {con.status}
                              </span>
                            </div>

                            <p className="text-sm font-semibold leading-snug line-clamp-2 mb-1">
                              {con.projectDescription
                                ? con.projectDescription.length > 100
                                  ? con.projectDescription.slice(0, 100) + "…"
                                  : con.projectDescription
                                : "Service Agreement"}
                            </p>

                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#555555] mt-2">
                              <span>Date: {con.date}</span>
                              <span>
                                Amount:{" "}
                                <span className="text-[#A0A0A0] font-semibold">
                                  {formatAmount(con.totalAmount, con.currency)}
                                </span>
                              </span>
                              {con.duration && <span>Duration: {con.duration}</span>}
                            </div>

                            {/* Signed confirmation */}
                            {isSigned && (
                              <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Signed by {con.clientSignatureName}
                                {con.signedAt ? ` · ${con.signedAt}` : ""}
                              </div>
                            )}
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-2 shrink-0">
                            {/* Download PDF */}
                            <button
                              onClick={() => handleDownloadContract(con)}
                              disabled={isDownloading}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/20 hover:bg-[#FF6B00]/20 disabled:opacity-50 px-3 py-2 rounded-lg transition-colors"
                            >
                              {isDownloading ? (
                                <div className="w-3 h-3 border border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Download className="w-3 h-3" />
                              )}
                              <span className="hidden sm:inline">Download</span> PDF
                            </button>

                            {/* Sign button */}
                            {!isSigned && (
                              <button
                                onClick={() => openSigningModal(con)}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#FF6B00] hover:bg-[#FF6B00]/90 px-3 py-2 rounded-lg transition-colors shadow-md shadow-[#FF6B00]/10"
                              >
                                <PenLine className="w-3 h-3" />
                                Sign Contract
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {/* ── Contract Signing Modal ── */}
      {signingContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#111111] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center">
                  <PenLine className="w-4 h-4 text-[#FF6B00]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Sign Service Agreement</h3>
                  <p className="text-xs text-[#555555] mt-0.5">
                    #{signingContract.contractNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={closeSigningModal}
                className="w-8 h-8 flex items-center justify-center text-[#555555] hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Contract summary */}
              <div className="bg-[#0A0A0A] border border-white/[0.06] rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#FF6B00] mb-3">
                  Agreement Summary
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div>
                    <span className="text-[#555555]">Contract #</span>
                    <p className="text-white font-mono font-semibold mt-0.5">
                      {signingContract.contractNumber}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#555555]">Client</span>
                    <p className="text-white font-semibold mt-0.5">{signingContract.clientName}</p>
                  </div>
                  <div>
                    <span className="text-[#555555]">Project</span>
                    <p className="text-white mt-0.5 line-clamp-2">
                      {signingContract.projectDescription
                        ? signingContract.projectDescription.length > 60
                          ? signingContract.projectDescription.slice(0, 60) + "…"
                          : signingContract.projectDescription
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#555555]">Total Amount</span>
                    <p className="text-[#FF6B00] font-bold mt-0.5">
                      {formatAmount(signingContract.totalAmount, signingContract.currency)}
                    </p>
                  </div>
                  {signingContract.duration && (
                    <div>
                      <span className="text-[#555555]">Duration</span>
                      <p className="text-white mt-0.5">{signingContract.duration}</p>
                    </div>
                  )}
                  {signingContract.startDate && (
                    <div>
                      <span className="text-[#555555]">Start Date</span>
                      <p className="text-white mt-0.5">{signingContract.startDate}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Terms preview */}
              <div className="bg-[#0A0A0A] border border-white/[0.06] rounded-xl p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#FF6B00] mb-3">
                  Key Terms
                </p>
                <ul className="space-y-2">
                  {[
                    "All deliverables will be provided as agreed in the project brief and scope of work.",
                    `Payment of ${formatAmount(signingContract.totalAmount, signingContract.currency)} is due per the stated payment schedule: ${signingContract.paymentSchedule || "as agreed"}.`,
                    `This project includes ${signingContract.revisions ?? 2} rounds of revisions. Additional revisions are billed separately.`,
                    "Upon full payment, all deliverables become the exclusive property of the Client.",
                    "Either party may terminate this agreement with 14 days written notice.",
                    "This agreement is governed by the laws of India. Disputes resolved through arbitration in New Delhi.",
                  ].map((term, i) => (
                    <li key={i} className="flex gap-2 text-xs text-[#A0A0A0] leading-relaxed">
                      <span className="text-[#FF6B00] shrink-0 mt-0.5">·</span>
                      {term}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Signature input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">
                  Type your full legal name to sign *
                </label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder="e.g. John Smith"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#FF6B00]/50 focus:outline-none transition-colors placeholder-white/20"
                />
              </div>

              {/* Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div
                  className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                    agreedToTerms
                      ? "bg-[#FF6B00] border-[#FF6B00]"
                      : "border-white/20 group-hover:border-[#FF6B00]/40"
                  }`}
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                >
                  {agreedToTerms && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                <span className="text-xs text-[#A0A0A0] leading-relaxed">
                  I have read and agree to all terms of this service agreement. I understand
                  that by typing my name and clicking &quot;Sign Contract&quot;, I am providing a
                  legally binding digital signature.
                </span>
              </label>

              {/* Action buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={closeSigningModal}
                  className="flex-1 text-sm font-semibold text-[#A0A0A0] bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignContract}
                  disabled={!signerName.trim() || !agreedToTerms || signingLoading}
                  className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#FF6B00] hover:bg-[#FF6B00]/90 disabled:opacity-40 disabled:cursor-not-allowed py-3 rounded-xl transition-colors shadow-lg shadow-[#FF6B00]/10"
                >
                  {signingLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing…
                    </>
                  ) : (
                    <>
                      <PenLine className="w-4 h-4" />
                      Sign Contract
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
