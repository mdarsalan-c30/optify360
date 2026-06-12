"use client";

import { useState, useEffect, useRef } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, serverTimestamp, setDoc,
} from "firebase/firestore";
import { getUserRecord, upsertUserRecord, createClientAuthAccount } from "@/lib/authHelpers";
import { generateInvoicePDF, generateContractPDF } from "@/lib/pdfGenerator";
import type { AgencySettings, InvoiceData, ContractData } from "@/lib/pdfGenerator";
import {
  KeyRound, LogOut, Users, FileText, FilePen, Settings2, Plus, Edit,
  Trash2, X, CheckCircle, Download, RefreshCw, Search, Upload,
  Building2, Mail, Phone, MapPin, LayoutDashboard, Briefcase,
  Clock, DollarSign, IndianRupee, MoreVertical, ChevronDown, Eye,
  Send, ShieldCheck, Sparkles,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type Tab = "clients" | "invoices" | "contracts" | "settings" | "blogs";
type InvoiceStatus = "Draft" | "Sent" | "Paid";
type ContractStatus = "Draft" | "Sent" | "Signed";
type ProjectStatus =
  | "Inquiry"
  | "Proposal Sent"
  | "Contract Signed"
  | "In Progress"
  | "Review"
  | "Delivered"
  | "Completed";

interface Client {
  id: string;
  uid?: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  projectName?: string;
  projectStatus: ProjectStatus;
  notes?: string;
  createdAt?: any;
}

interface InvoiceItem { description: string; quantity: number; rate: number; }

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  date: string;
  dueDate: string;
  currency: "INR" | "USD";
  items: InvoiceItem[];
  taxPercent?: number;
  notes?: string;
  paymentTerms?: string;
  status: InvoiceStatus;
  createdAt?: any;
}

interface Contract {
  id: string;
  contractNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  date: string;
  projectDescription: string;
  totalAmount: number;
  currency: "INR" | "USD";
  paymentSchedule: string;
  duration: string;
  startDate: string;
  endDate: string;
  revisions: number;
  status: ContractStatus;
  signedByClient: boolean;
  clientSignatureName?: string;
  signedAt?: string;
  customTerms?: string;
  createdAt?: any;
}

export interface AdminBlog {
  id?: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  coverImage: string;
  excerpt: string;
  content: string;
  publishDate: string;
  faqs: { question: string; answer: string }[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  Draft: "bg-zinc-700/40 text-zinc-400 border-zinc-600/30",
  Sent: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  Paid: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  Signed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  Inquiry: "bg-zinc-700/40 text-zinc-400 border-zinc-600/30",
  "Proposal Sent": "bg-blue-500/15 text-blue-400 border-blue-500/25",
  "Contract Signed": "bg-violet-500/15 text-violet-400 border-violet-500/25",
  "In Progress": "bg-orange-500/15 text-orange-400 border-orange-500/25",
  Review: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  Delivered: "bg-teal-500/15 text-teal-400 border-teal-500/25",
  Completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
};

const SYM: Record<string, string> = { INR: "₹", USD: "$" };
const TODAY = new Date().toISOString().split("T")[0];

function Badge({ label }: { label: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_COLORS[label] || "bg-zinc-700/40 text-zinc-400 border-zinc-600/30"}`}>
      {label}
    </span>
  );
}

function fmtAmt(amount: number, currency: string) {
  const sym = SYM[currency] || "₹";
  return `${sym}${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

function nextInvoiceNumber(invoices: Invoice[]) {
  const nums = invoices.map(i => parseInt(i.invoiceNumber.replace(/\D/g, ""), 10)).filter(Boolean);
  const max = nums.length ? Math.max(...nums) : 0;
  return `INV-${String(max + 1).padStart(3, "0")}`;
}

function nextContractNumber(contracts: Contract[]) {
  const nums = contracts.map(c => parseInt(c.contractNumber.replace(/\D/g, ""), 10)).filter(Boolean);
  const max = nums.length ? Math.max(...nums) : 0;
  return `CON-${String(max + 1).padStart(3, "0")}`;
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function AgencyAdminPage() {
  // Auth
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  // UI
  const [activeTab, setActiveTab] = useState<Tab>("clients");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Data
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [agencySettings, setAgencySettings] = useState<AgencySettings>({
    agencyName: "Optify360",
    agencyEmail: "optify360official@gmail.com",
    agencyPhone: "",
    agencyAddress: "Suite 100, Tech District, New Delhi, DL 110001, India",
    logoUrl: "",
    signatureUrl: "",
    defaultInvoiceNotes: "",
    defaultInvoiceTerms: "Payment due within 14 days of invoice date.",
    defaultContractTerms: "",
  });

  // Settings form
  const [settingsForm, setSettingsForm] = useState({ ...agencySettings });
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingSig, setUploadingSig] = useState(false);

  // Client modal
  const [showClientModal, setShowClientModal] = useState(false);
  const [editClientId, setEditClientId] = useState<string | null>(null);
  const [clientForm, setClientForm] = useState({
    name: "", email: "", company: "", phone: "",
    projectName: "", projectStatus: "Inquiry" as ProjectStatus,
    notes: "", password: "",
  });
  const [clientSaving, setClientSaving] = useState(false);

  // Invoice modal
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editInvoiceId, setEditInvoiceId] = useState<string | null>(null);
  const [invoiceForm, setInvoiceForm] = useState({
    clientId: "", date: TODAY, dueDate: "", currency: "INR" as "INR" | "USD",
    items: [{ description: "", quantity: 1, rate: 0 }] as InvoiceItem[],
    taxPercent: 18, notes: "", paymentTerms: "Payment due within 14 days of invoice date.",
    status: "Draft" as InvoiceStatus,
  });
  const [invoiceSaving, setInvoiceSaving] = useState(false);

  // Contract modal
  const [showContractModal, setShowContractModal] = useState(false);
  const [editContractId, setEditContractId] = useState<string | null>(null);
  const [contractForm, setContractForm] = useState({
    clientId: "", date: TODAY, projectDescription: "",
    totalAmount: 0, currency: "INR" as "INR" | "USD",
    paymentSchedule: "50% advance, 50% on delivery",
    duration: "1 month", startDate: TODAY, endDate: "",
    revisions: 3, status: "Draft" as ContractStatus, customTerms: "",
  });
  const [contractSaving, setContractSaving] = useState(false);

  // Blog editor
  const [showBlogEditor, setShowBlogEditor] = useState(false);
  const [editBlogId, setEditBlogId] = useState<string | null>(null);
  const [blogForm, setBlogForm] = useState<AdminBlog>({
    title: "", slug: "", category: "Engineering", author: "Md Arsalan",
    coverImage: "", excerpt: "", content: "", publishDate: TODAY, faqs: []
  });
  const [blogSaving, setBlogSaving] = useState(false);

  // PDF generating state
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null);

  // ── Auth ────────────────────────────────────────────────────────────────────

  // Whitelisted admin emails — auto-bootstrapped as admin on first login
  const ADMIN_EMAILS = [
    "admin@optify360.com",
    "arsalan@optify360.in",
    "optify360official@gmail.com",
  ];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          let record = await getUserRecord(user.uid);

          // Auto-create admin record for whitelisted emails on first login
          if (!record && ADMIN_EMAILS.includes(user.email || "")) {
            await upsertUserRecord(user.uid, user.email!, "admin", user.email!.split("@")[0]);
            record = await getUserRecord(user.uid);
          }

          if (record?.role === "admin") {
            setIsLoggedIn(true);
            fetchAllData();
          } else {
            // User successfully fetched but is NOT an admin
            // Do NOT call signOut(auth) here, otherwise it logs them out globally!
            setLoginError("Access denied. This portal is for agency admins only.");
            setIsLoggedIn(false);
          }
        } catch (err: any) {
          console.error("Auth sync error:", err);
          // Don't sign out on network/permission errors to prevent aggressive logout
          setLoginError(`Verification delayed: ${err.message}. Please refresh.`);
          setIsLoggedIn(false); // Just hide dashboard, don't force signOut
        }
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, emailInput, passwordInput);
    } catch {
      setLoginError("Invalid email or password.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => { await signOut(auth); };

  // ── Data Fetching ───────────────────────────────────────────────────────────

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchClients(), fetchInvoices(), fetchContracts(), fetchSettings(), fetchBlogs()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    const snap = await getDocs(query(collection(db, "clients"), orderBy("createdAt", "desc")));
    setClients(snap.docs.map(d => ({ id: d.id, ...d.data() } as Client)));
  };

  const fetchInvoices = async () => {
    const snap = await getDocs(query(collection(db, "invoices"), orderBy("createdAt", "desc")));
    setInvoices(snap.docs.map(d => ({ id: d.id, ...d.data() } as Invoice)));
  };

  const fetchContracts = async () => {
    const snap = await getDocs(query(collection(db, "contracts"), orderBy("createdAt", "desc")));
    setContracts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Contract)));
  };

  const fetchSettings = async () => {
    const snap = await getDoc(doc(db, "settings", "main"));
    if (snap.exists()) {
      const data = snap.data() as AgencySettings;
      setAgencySettings(data);
      setSettingsForm(data);
    }
  };

  const fetchBlogs = async () => {
    const snap = await getDocs(query(collection(db, "blogs"), orderBy("createdAt", "desc")));
    setBlogs(snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminBlog)));
  };

  const notify = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  // ── Cloudinary Upload ───────────────────────────────────────────────────────

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "optify360");
    fd.append("folder", "optify360/branding");
    const res = await fetch("https://api.cloudinary.com/v1_1/dakusigxm/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!data.secure_url) throw new Error("Upload failed");
    return data.secure_url;
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingLogo(true);
    try {
      const url = await uploadToCloudinary(file);
      setSettingsForm(prev => ({ ...prev, logoUrl: url }));
      notify("Logo uploaded successfully.");
    } catch { alert("Failed to upload logo."); } finally { setUploadingLogo(false); }
  };

  const handleSigUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadingSig(true);
    try {
      const url = await uploadToCloudinary(file);
      setSettingsForm(prev => ({ ...prev, signatureUrl: url }));
      notify("Digital signature uploaded successfully.");
    } catch { alert("Failed to upload signature."); } finally { setUploadingSig(false); }
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await setDoc(doc(db, "settings", "main"), settingsForm, { merge: true });
    setAgencySettings(settingsForm);
    notify("Agency settings saved successfully.");
  };

  // ── Client CRUD ─────────────────────────────────────────────────────────────

  const openAddClient = () => {
    setEditClientId(null);
    setClientForm({ name: "", email: "", company: "", phone: "", projectName: "", projectStatus: "Inquiry", notes: "", password: "" });
    setShowClientModal(true);
  };

  const openEditClient = (c: Client) => {
    setEditClientId(c.id);
    setClientForm({ name: c.name, email: c.email, company: c.company || "", phone: c.phone || "", projectName: c.projectName || "", projectStatus: c.projectStatus, notes: c.notes || "", password: "" });
    setShowClientModal(true);
  };

  const saveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientSaving(true);
    try {
      if (editClientId) {
        // Edit
        await updateDoc(doc(db, "clients", editClientId), {
          name: clientForm.name, email: clientForm.email,
          company: clientForm.company, phone: clientForm.phone,
          projectName: clientForm.projectName, projectStatus: clientForm.projectStatus,
          notes: clientForm.notes, updatedAt: serverTimestamp(),
        });
        notify("Client updated successfully.");
      } else {
        // Create Firebase Auth account for client
        let uid: string | undefined;
        if (clientForm.password) {
          uid = await createClientAuthAccount(clientForm.email, clientForm.password);
        }

        // Add to clients collection
        const clientRef = await addDoc(collection(db, "clients"), {
          name: clientForm.name, email: clientForm.email,
          company: clientForm.company, phone: clientForm.phone,
          projectName: clientForm.projectName, projectStatus: clientForm.projectStatus,
          notes: clientForm.notes, uid: uid || null,
          createdAt: serverTimestamp(),
        });

        // Create user record in Firestore
        if (uid) {
          await upsertUserRecord(uid, clientForm.email, "client", clientForm.name, clientRef.id);
        }
        notify("Client created successfully.");
      }
      setShowClientModal(false);
      fetchClients();
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message || "Failed to save client."}`);
    } finally {
      setClientSaving(false);
    }
  };

  const deleteClient = async (id: string) => {
    if (!confirm("Delete this client? This won't delete their invoices or contracts.")) return;
    await deleteDoc(doc(db, "clients", id));
    notify("Client deleted.");
    fetchClients();
  };

  // ── Invoice CRUD ────────────────────────────────────────────────────────────

  const openAddInvoice = (clientId?: string) => {
    setEditInvoiceId(null);
    const client = clients.find(c => c.id === clientId);
    setInvoiceForm({
      clientId: clientId || "",
      date: TODAY, dueDate: TODAY,
      currency: "INR",
      items: [{ description: client ? `Services for ${client.projectName || "project"}` : "", quantity: 1, rate: 0 }],
      taxPercent: 18, notes: agencySettings.defaultInvoiceNotes || "",
      paymentTerms: agencySettings.defaultInvoiceTerms || "Payment due within 14 days of invoice date.",
      status: "Draft",
    });
    setShowInvoiceModal(true);
  };

  const openEditInvoice = (inv: Invoice) => {
    setEditInvoiceId(inv.id);
    setInvoiceForm({
      clientId: inv.clientId, date: inv.date, dueDate: inv.dueDate,
      currency: inv.currency, items: inv.items, taxPercent: inv.taxPercent ?? 18,
      notes: inv.notes || "", paymentTerms: inv.paymentTerms || "", status: inv.status,
    });
    setShowInvoiceModal(true);
  };

  const saveInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvoiceSaving(true);
    const client = clients.find(c => c.id === invoiceForm.clientId);
    const payload = {
      ...invoiceForm,
      invoiceNumber: editInvoiceId ? undefined : nextInvoiceNumber(invoices),
      clientName: client?.name || "",
      clientEmail: client?.email || "",
      clientCompany: client?.company || "",
      updatedAt: serverTimestamp(),
    };
    try {
      if (editInvoiceId) {
        await updateDoc(doc(db, "invoices", editInvoiceId), payload);
        notify("Invoice updated.");
      } else {
        await addDoc(collection(db, "invoices"), { ...payload, createdAt: serverTimestamp() });
        notify("Invoice created.");
      }
      setShowInvoiceModal(false);
      fetchInvoices();
    } catch (err) { console.error(err); alert("Failed to save invoice."); }
    finally { setInvoiceSaving(false); }
  };

  const deleteInvoice = async (id: string) => {
    if (!confirm("Delete this invoice?")) return;
    await deleteDoc(doc(db, "invoices", id));
    notify("Invoice deleted."); fetchInvoices();
  };

  const updateInvoiceStatus = async (id: string, status: InvoiceStatus) => {
    await updateDoc(doc(db, "invoices", id), { status });
    notify(`Invoice marked as ${status}.`); fetchInvoices();
  };

  const downloadInvoice = async (inv: Invoice, action: 'save' | 'view' = 'save') => {
    setGeneratingPDF(inv.id);
    try {
      const data: InvoiceData = {
        invoiceNumber: inv.invoiceNumber, date: inv.date, dueDate: inv.dueDate,
        currency: inv.currency, items: inv.items, taxPercent: inv.taxPercent,
        notes: inv.notes, paymentTerms: inv.paymentTerms,
        clientName: inv.clientName, clientEmail: inv.clientEmail, clientCompany: inv.clientCompany,
      };
      await generateInvoicePDF(data, agencySettings, action);
    } finally { setGeneratingPDF(null); }
  };

  // ── Contract CRUD ───────────────────────────────────────────────────────────

  const openAddContract = (clientId?: string) => {
    setEditContractId(null);
    setContractForm({
      clientId: clientId || "", date: TODAY,
      projectDescription: "", totalAmount: 0, currency: "INR",
      paymentSchedule: "50% advance, 50% on delivery",
      duration: "1 month", startDate: TODAY, endDate: "", revisions: 3,
      status: "Draft",
      customTerms: agencySettings.defaultContractTerms || "",
    });
    setShowContractModal(true);
  };

  const openEditContract = (c: Contract) => {
    setEditContractId(c.id);
    setContractForm({
      clientId: c.clientId, date: c.date, projectDescription: c.projectDescription,
      totalAmount: c.totalAmount, currency: c.currency, paymentSchedule: c.paymentSchedule,
      duration: c.duration, startDate: c.startDate, endDate: c.endDate,
      revisions: c.revisions, status: c.status,
      customTerms: c.customTerms || "",
    });
    setShowContractModal(true);
  };

  const saveContract = async (e: React.FormEvent) => {
    e.preventDefault();
    setContractSaving(true);
    const client = clients.find(c => c.id === contractForm.clientId);
    const payload = {
      ...contractForm,
      contractNumber: editContractId ? undefined : nextContractNumber(contracts),
      clientName: client?.name || "", clientEmail: client?.email || "",
      clientCompany: client?.company || "",
      signedByClient: false, clientSignatureName: "", signedAt: "",
      updatedAt: serverTimestamp(),
    };
    try {
      if (editContractId) {
        await updateDoc(doc(db, "contracts", editContractId), payload);
        notify("Contract updated.");
      } else {
        await addDoc(collection(db, "contracts"), { ...payload, createdAt: serverTimestamp() });
        notify("Contract created.");
      }
      setShowContractModal(false);
      fetchContracts();
    } catch (err) { console.error(err); alert("Failed to save contract."); }
    finally { setContractSaving(false); }
  };

  const deleteContract = async (id: string) => {
    if (!confirm("Delete this contract?")) return;
    await deleteDoc(doc(db, "contracts", id));
    notify("Contract deleted."); fetchContracts();
  };

  const updateContractStatus = async (id: string, status: ContractStatus) => {
    await updateDoc(doc(db, "contracts", id), { status });
    notify(`Contract marked as ${status}.`); fetchContracts();
  };

  const downloadContract = async (c: Contract, action: 'save' | 'view' = 'save') => {
    setGeneratingPDF(c.id);
    try {
      const data: ContractData = {
        contractNumber: c.contractNumber, date: c.date,
        clientName: c.clientName, clientEmail: c.clientEmail, clientCompany: c.clientCompany,
        projectDescription: c.projectDescription, totalAmount: c.totalAmount, currency: c.currency,
        paymentSchedule: c.paymentSchedule, duration: c.duration,
        startDate: c.startDate, endDate: c.endDate, revisions: c.revisions,
        signedByClient: c.signedByClient, clientSignatureName: c.clientSignatureName,
        signedAt: c.signedAt,
      };
      await generateContractPDF(data, agencySettings, action);
    } finally { setGeneratingPDF(null); }
  };

  // ── Blog CRUD ─────────────────────────────────────────────────────────────────

  const openAddBlog = () => {
    setEditBlogId(null);
    setBlogForm({
      title: "", slug: "", category: "Engineering", author: "Md Arsalan",
      coverImage: "", excerpt: "", content: "", publishDate: TODAY, faqs: []
    });
    setShowBlogEditor(true);
  };

  const openEditBlog = (b: AdminBlog) => {
    setEditBlogId(b.id || null);
    setBlogForm({
      title: b.title, slug: b.slug, category: b.category, author: b.author,
      coverImage: b.coverImage, excerpt: b.excerpt, content: b.content || "",
      publishDate: b.publishDate || TODAY, faqs: b.faqs || []
    });
    setShowBlogEditor(true);
  };

  const saveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogSaving(true);
    const payload = {
      ...blogForm,
      updatedAt: serverTimestamp(),
    };
    try {
      if (editBlogId) {
        await updateDoc(doc(db, "blogs", editBlogId), payload);
        notify("Blog updated.");
      } else {
        await addDoc(collection(db, "blogs"), { ...payload, createdAt: serverTimestamp() });
        notify("Blog scheduled/published.");
      }
      setShowBlogEditor(false);
      fetchBlogs();
    } catch (err) { console.error(err); alert("Failed to save blog."); }
    finally { setBlogSaving(false); }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    await deleteDoc(doc(db, "blogs", id));
    notify("Blog deleted."); fetchBlogs();
  };

  // ── Filtered Data ───────────────────────────────────────────────────────────

  const filteredClients = clients.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredInvoices = invoices.filter(i =>
    i.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredContracts = contracts.filter(c =>
    c.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contractNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Invoice line item helpers ───────────────────────────────────────────────

  const addLineItem = () =>
    setInvoiceForm(p => ({ ...p, items: [...p.items, { description: "", quantity: 1, rate: 0 }] }));
  const updateLineItem = (idx: number, field: keyof InvoiceItem, val: string | number) =>
    setInvoiceForm(p => ({ ...p, items: p.items.map((item, i) => i === idx ? { ...item, [field]: val } : item) }));
  const removeLineItem = (idx: number) =>
    setInvoiceForm(p => ({ ...p, items: p.items.filter((_, i) => i !== idx) }));

  const invoiceSubtotal = invoiceForm.items.reduce((s, i) => s + i.quantity * i.rate, 0);
  const invoiceTax = invoiceSubtotal * (invoiceForm.taxPercent / 100);
  const invoiceTotal = invoiceSubtotal + invoiceTax;

  // ── Input styles ────────────────────────────────────────────────────────────

  const inp = "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-[#FF6B00]/50 outline-none transition-colors text-white placeholder:text-zinc-600";
  const lbl = "block text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-1.5";
  const btn = "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all";
  const btnPrimary = `${btn} bg-[#FF6B00] hover:bg-[#FF6B00]/85 text-white shadow-lg shadow-[#FF6B00]/10`;
  const btnSecondary = `${btn} bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300`;
  const btnDanger = `${btn} bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400`;

  // ── Login Screen ────────────────────────────────────────────────────────────

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FF6B00]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="w-full max-w-md bg-[#111111] border border-white/[0.07] rounded-2xl p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00] mx-auto mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold">Agency Admin</h1>
            <p className="text-sm text-zinc-500 mt-1">Optify360 — CRM & Project Management</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={lbl}>Email Address</label>
              <input type="email" required value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="admin@optify360.com" className={inp} />
            </div>
            <div>
              <label className={lbl}>Password</label>
              <input type="password" required value={passwordInput} onChange={e => setPasswordInput(e.target.value)} placeholder="••••••••••••" className={inp} />
            </div>
            {loginError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-lg text-center">{loginError}</div>
            )}
            <button type="submit" disabled={loginLoading} className={`${btnPrimary} w-full justify-center mt-2 disabled:opacity-60`}>
              {loginLoading ? "Signing In…" : "Sign In to Dashboard"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ── Dashboard ───────────────────────────────────────────────────────────────

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "clients", label: "Clients", icon: <Users className="w-4 h-4" />, count: clients.length },
    { id: "invoices", label: "Invoices", icon: <FileText className="w-4 h-4" />, count: invoices.length },
    { id: "contracts", label: "Contracts", icon: <FilePen className="w-4 h-4" />, count: contracts.length },
    { id: "blogs", label: "Blogs", icon: <Sparkles className="w-4 h-4" />, count: blogs.length },
    { id: "settings", label: "Settings", icon: <Settings2 className="w-4 h-4" /> },
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* Success Toast */}
      {successMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] border-2 border-emerald-500 text-emerald-400 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 font-semibold animate-bounce">
          <CheckCircle className="w-5 h-5" />
          {successMsg}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-white/[0.05] bg-[#080808] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#FF6B00]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#FF6B00] font-bold font-mono">Agency CRM</span>
              <h1 className="text-lg font-bold leading-none">Optify360</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => fetchAllData()} disabled={loading} className={btnSecondary}>
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>
            <button onClick={handleLogout} className={btnDanger}>
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-white/[0.04] bg-[#090909] px-6 py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4">
          {[
            { label: "Total Clients", value: clients.length, color: "text-blue-400" },
            { label: "Total Invoices", value: invoices.length, color: "text-[#FF6B00]" },
            { label: "Paid Invoices", value: invoices.filter(i => i.status === "Paid").length, color: "text-emerald-400" },
            { label: "Signed Contracts", value: contracts.filter(c => c.signedByClient).length, color: "text-violet-400" },
          ].map(stat => (
            <div key={stat.label} className="bg-[#111111] border border-white/[0.05] rounded-xl p-3">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-mono">{stat.label}</span>
              <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/[0.05] pb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchTerm(""); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/15" : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"}`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-[11px] px-1.5 rounded-full ${activeTab === tab.id ? "bg-white/20" : "bg-white/[0.06]"}`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── CLIENTS TAB ── */}
        {activeTab === "clients" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search clients…" className={`${inp} pl-9`} />
              </div>
              <button onClick={openAddClient} className={btnPrimary}>
                <Plus className="w-4 h-4" /> Add Client
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.05] bg-[#111111]">
                    {["Client", "Project", "Status", "Contact", "Actions"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-zinc-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map(c => (
                    <tr key={c.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{c.name}</div>
                        <div className="text-xs text-zinc-500">{c.company}</div>
                      </td>
                      <td className="px-4 py-3 text-zinc-300">{c.projectName || "—"}</td>
                      <td className="px-4 py-3"><Badge label={c.projectStatus} /></td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-zinc-400">{c.email}</div>
                        <div className="text-xs text-zinc-600">{c.phone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openAddInvoice(c.id)} title="Create Invoice" className="text-zinc-500 hover:text-[#FF6B00] transition-colors"><FileText className="w-4 h-4" /></button>
                          <button onClick={() => openAddContract(c.id)} title="Create Contract" className="text-zinc-500 hover:text-violet-400 transition-colors"><FilePen className="w-4 h-4" /></button>
                          <button onClick={() => openEditClient(c)} title="Edit" className="text-zinc-500 hover:text-white transition-colors"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => deleteClient(c.id)} title="Delete" className="text-zinc-500 hover:text-rose-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredClients.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-12 text-zinc-600">No clients found. Add your first client to get started.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── INVOICES TAB ── */}
        {activeTab === "invoices" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search invoices…" className={`${inp} pl-9`} />
              </div>
              <button onClick={() => openAddInvoice()} className={btnPrimary}>
                <Plus className="w-4 h-4" /> New Invoice
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.05] bg-[#111111]">
                    {["Invoice #", "Client", "Date", "Due Date", "Amount", "Status", "Actions"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-zinc-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map(inv => {
                    const subtotal = inv.items.reduce((s, i) => s + i.quantity * i.rate, 0);
                    const tax = inv.taxPercent ? subtotal * (inv.taxPercent / 100) : 0;
                    const total = subtotal + tax;
                    return (
                      <tr key={inv.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3 font-mono text-[#FF6B00] font-semibold">{inv.invoiceNumber}</td>
                        <td className="px-4 py-3">
                          <div className="font-semibold">{inv.clientName}</div>
                          <div className="text-xs text-zinc-500">{inv.clientCompany}</div>
                        </td>
                        <td className="px-4 py-3 text-zinc-400">{inv.date}</td>
                        <td className="px-4 py-3 text-zinc-400">{inv.dueDate}</td>
                        <td className="px-4 py-3 font-semibold">{fmtAmt(total, inv.currency)}</td>
                        <td className="px-4 py-3"><Badge label={inv.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => downloadInvoice(inv, 'view')} disabled={generatingPDF === inv.id} title="View PDF" className="text-zinc-500 hover:text-white transition-colors disabled:opacity-50">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => downloadInvoice(inv, 'save')} disabled={generatingPDF === inv.id} title="Download PDF" className="text-zinc-500 hover:text-[#FF6B00] transition-colors disabled:opacity-50">
                              {generatingPDF === inv.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            </button>
                            {inv.status !== "Paid" && (
                              <button onClick={() => updateInvoiceStatus(inv.id, inv.status === "Draft" ? "Sent" : "Paid")} title={inv.status === "Draft" ? "Mark Sent" : "Mark Paid"} className="text-zinc-500 hover:text-emerald-400 transition-colors">
                                {inv.status === "Draft" ? <Send className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                              </button>
                            )}
                            <button onClick={() => openEditInvoice(inv)} title="Edit" className="text-zinc-500 hover:text-white transition-colors"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => deleteInvoice(inv.id)} title="Delete" className="text-zinc-500 hover:text-rose-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredInvoices.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-12 text-zinc-600">No invoices yet. Create one from a client record.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CONTRACTS TAB ── */}
        {activeTab === "contracts" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search contracts…" className={`${inp} pl-9`} />
              </div>
              <button onClick={() => openAddContract()} className={btnPrimary}>
                <Plus className="w-4 h-4" /> New Contract
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.05] bg-[#111111]">
                    {["Contract #", "Client", "Date", "Amount", "Status", "Signed", "Actions"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-zinc-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredContracts.map(c => (
                    <tr key={c.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 font-mono text-violet-400 font-semibold">{c.contractNumber}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold">{c.clientName}</div>
                        <div className="text-xs text-zinc-500">{c.clientCompany}</div>
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{c.date}</td>
                      <td className="px-4 py-3 font-semibold">{fmtAmt(c.totalAmount, c.currency)}</td>
                      <td className="px-4 py-3"><Badge label={c.status} /></td>
                      <td className="px-4 py-3">
                        {c.signedByClient
                          ? <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />{c.clientSignatureName}</span>
                          : <span className="text-zinc-600 text-xs">Pending</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => downloadContract(c, 'view')} disabled={generatingPDF === c.id} title="View PDF" className="text-zinc-500 hover:text-white transition-colors disabled:opacity-50">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => downloadContract(c, 'save')} disabled={generatingPDF === c.id} title="Download PDF" className="text-zinc-500 hover:text-violet-400 transition-colors disabled:opacity-50">
                            {generatingPDF === c.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                          </button>
                          {c.status === "Draft" && (
                            <button onClick={() => updateContractStatus(c.id, "Sent")} title="Mark Sent" className="text-zinc-500 hover:text-blue-400 transition-colors"><Send className="w-4 h-4" /></button>
                          )}
                          <button onClick={() => openEditContract(c)} title="Edit" className="text-zinc-500 hover:text-white transition-colors"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => deleteContract(c.id)} title="Delete" className="text-zinc-500 hover:text-rose-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredContracts.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-12 text-zinc-600">No contracts yet. Create one from a client record.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── BLOGS TAB ── */}
        {activeTab === "blogs" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search blogs…" className={`${inp} pl-9`} />
              </div>
              <button onClick={() => openAddBlog()} className={btnPrimary}>
                <Plus className="w-4 h-4" /> New Post
              </button>
            </div>
            
            <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.05] bg-[#111111]">
                    {["Title", "Slug", "Category", "Publish Date", "Status", "Actions"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-zinc-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {blogs.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase())).map(b => {
                    const isPublished = new Date(b.publishDate || "").getTime() <= Date.now();
                    return (
                      <tr key={b.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3 font-semibold text-white">{b.title}</td>
                        <td className="px-4 py-3 text-zinc-400">/{b.slug}</td>
                        <td className="px-4 py-3">
                          <span className="text-[11px] bg-white/[0.06] px-2 py-1 rounded font-mono">{b.category}</span>
                        </td>
                        <td className="px-4 py-3 text-zinc-400">{b.publishDate}</td>
                        <td className="px-4 py-3">
                          {isPublished ? <Badge label="Published" /> : <Badge label="Scheduled" />}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEditBlog(b)} title="Edit" className="text-zinc-500 hover:text-white transition-colors"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => deleteBlog(b.id!)} title="Delete" className="text-zinc-500 hover:text-rose-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {blogs.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-12 text-zinc-600">No blogs published yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {activeTab === "settings" && (
          <form onSubmit={saveSettings} className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-lg font-bold mb-1">Agency Branding & Settings</h2>
              <p className="text-sm text-zinc-500">Configure your agency profile. Logo and signature appear on all generated PDFs.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Agency Name</label>
                <input value={settingsForm.agencyName || ""} onChange={e => setSettingsForm(p => ({ ...p, agencyName: e.target.value }))} placeholder="Optify360" className={inp} />
              </div>
              <div>
                <label className={lbl}>Agency Email</label>
                <input type="email" value={settingsForm.agencyEmail || ""} onChange={e => setSettingsForm(p => ({ ...p, agencyEmail: e.target.value }))} placeholder="optify360official@gmail.com" className={inp} />
              </div>
              <div>
                <label className={lbl}>Phone Number</label>
                <input value={settingsForm.agencyPhone || ""} onChange={e => setSettingsForm(p => ({ ...p, agencyPhone: e.target.value }))} placeholder="+91 9876543210" className={inp} />
              </div>
              <div>
                <label className={lbl}>Address</label>
                <input value={settingsForm.agencyAddress || ""} onChange={e => setSettingsForm(p => ({ ...p, agencyAddress: e.target.value }))} placeholder="Suite 100, New Delhi, India" className={inp} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={lbl}>Default Invoice Notes</label>
                <textarea value={settingsForm.defaultInvoiceNotes || ""} onChange={e => setSettingsForm(p => ({ ...p, defaultInvoiceNotes: e.target.value }))} rows={2} className={`${inp} resize-none`} placeholder="Bank details, UPI info, or thanks message..." />
              </div>
              <div>
                <label className={lbl}>Default Invoice Payment Terms</label>
                <input value={settingsForm.defaultInvoiceTerms || ""} onChange={e => setSettingsForm(p => ({ ...p, defaultInvoiceTerms: e.target.value }))} className={inp} placeholder="Payment due within 14 days of invoice date." />
              </div>
              <div>
                <label className={lbl}>Default Contract Terms & Conditions</label>
                <textarea value={settingsForm.defaultContractTerms || ""} onChange={e => setSettingsForm(p => ({ ...p, defaultContractTerms: e.target.value }))} rows={5} className={`${inp} resize-none`} placeholder="Leave blank to use the hardcoded default terms..." />
                <p className="text-xs text-zinc-500 mt-1">If provided, this replaces the Intellectual Property, Confidentiality, Revisions, Termination, and Liability sections in the contract.</p>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="bg-[#111111] border border-white/[0.07] rounded-xl p-5 space-y-3">
              <div>
                <p className="font-semibold text-sm">Agency Logo</p>
                <p className="text-xs text-zinc-500 mt-0.5">Used in the header of all generated PDFs. Recommended: PNG with transparent background.</p>
              </div>
              {settingsForm.logoUrl && (
                <div className="w-40 h-14 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 overflow-hidden">
                  <img src={settingsForm.logoUrl} alt="Logo" className="max-h-12 object-contain" />
                </div>
              )}
              <label className={`${btnSecondary} cursor-pointer`}>
                <Upload className="w-4 h-4" />
                {uploadingLogo ? "Uploading…" : "Upload Logo"}
                <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" onChange={handleLogoUpload} className="hidden" disabled={uploadingLogo} />
              </label>
            </div>

            {/* Signature Upload */}
            <div className="bg-[#111111] border border-white/[0.07] rounded-xl p-5 space-y-3">
              <div>
                <p className="font-semibold text-sm">Digital Signature</p>
                <p className="text-xs text-zinc-500 mt-0.5">Rendered in the "Authorized By" section of invoices and contracts. Upload a transparent PNG for best results.</p>
              </div>
              {settingsForm.signatureUrl && (
                <div className="w-40 h-14 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 overflow-hidden">
                  <img src={settingsForm.signatureUrl} alt="Signature" className="max-h-12 object-contain" />
                </div>
              )}
              <label className={`${btnSecondary} cursor-pointer`}>
                <Upload className="w-4 h-4" />
                {uploadingSig ? "Uploading…" : "Upload Signature"}
                <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" onChange={handleSigUpload} className="hidden" disabled={uploadingSig} />
              </label>
            </div>

            <button type="submit" className={btnPrimary}>
              <CheckCircle className="w-4 h-4" /> Save Settings
            </button>
          </form>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════════════════════════ */}

      {/* ── Client Modal ── */}
      {showClientModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/[0.08] rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">{editClientId ? "Edit Client" : "Add New Client"}</h2>
              <button onClick={() => setShowClientModal(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={saveClient} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Full Name *</label>
                  <input required value={clientForm.name} onChange={e => setClientForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Email *</label>
                  <input required type="email" value={clientForm.email} onChange={e => setClientForm(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Company</label>
                  <input value={clientForm.company} onChange={e => setClientForm(p => ({ ...p, company: e.target.value }))} placeholder="Acme Inc." className={inp} />
                </div>
                <div>
                  <label className={lbl}>Phone</label>
                  <input value={clientForm.phone} onChange={e => setClientForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 9876543210" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Project Name</label>
                  <input value={clientForm.projectName} onChange={e => setClientForm(p => ({ ...p, projectName: e.target.value }))} placeholder="E-commerce Platform" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Project Status</label>
                  <select value={clientForm.projectStatus} onChange={e => setClientForm(p => ({ ...p, projectStatus: e.target.value as ProjectStatus }))} className={inp}>
                    {["Inquiry", "Proposal Sent", "Contract Signed", "In Progress", "Review", "Delivered", "Completed"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              {!editClientId && (
                <div>
                  <label className={lbl}>Portal Password</label>
                  <input type="password" value={clientForm.password} onChange={e => setClientForm(p => ({ ...p, password: e.target.value }))} placeholder="Set a password for client portal access" className={inp} />
                  <p className="text-[11px] text-zinc-600 mt-1">Leave blank to skip creating a portal login for this client.</p>
                </div>
              )}
              <div>
                <label className={lbl}>Notes</label>
                <textarea value={clientForm.notes} onChange={e => setClientForm(p => ({ ...p, notes: e.target.value }))} placeholder="Internal notes about this client…" rows={2} className={`${inp} resize-none`} />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button type="submit" disabled={clientSaving} className={`${btnPrimary} disabled:opacity-60`}>
                  {clientSaving ? "Saving…" : (editClientId ? "Update Client" : "Create Client")}
                </button>
                <button type="button" onClick={() => setShowClientModal(false)} className={btnSecondary}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Invoice Modal ── */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/[0.08] rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">{editInvoiceId ? "Edit Invoice" : "Create Invoice"}</h2>
              <button onClick={() => setShowInvoiceModal(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={saveInvoice} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Client *</label>
                  <select required value={invoiceForm.clientId} onChange={e => setInvoiceForm(p => ({ ...p, clientId: e.target.value }))} className={inp}>
                    <option value="">Select client…</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ""}</option>)}
                  </select>
                </div>
                <div>
                  <label className={lbl}>Currency</label>
                  <select value={invoiceForm.currency} onChange={e => setInvoiceForm(p => ({ ...p, currency: e.target.value as "INR" | "USD" }))} className={inp}>
                    <option value="INR">INR (₹ Indian Rupee)</option>
                    <option value="USD">USD ($ US Dollar)</option>
                  </select>
                </div>
                <div>
                  <label className={lbl}>Invoice Date</label>
                  <input type="date" value={invoiceForm.date} onChange={e => setInvoiceForm(p => ({ ...p, date: e.target.value }))} className={inp} />
                </div>
                <div>
                  <label className={lbl}>Due Date</label>
                  <input type="date" value={invoiceForm.dueDate} onChange={e => setInvoiceForm(p => ({ ...p, dueDate: e.target.value }))} className={inp} />
                </div>
              </div>

              {/* Line Items */}
              <div>
                <label className={lbl}>Line Items</label>
                <div className="space-y-2">
                  {invoiceForm.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input value={item.description} onChange={e => updateLineItem(idx, "description", e.target.value)} placeholder="Description" className={`${inp} flex-1`} />
                      <input type="number" value={item.quantity} onChange={e => updateLineItem(idx, "quantity", +e.target.value)} placeholder="Qty" className={`${inp} w-16 text-center`} min={1} />
                      <input type="number" value={item.rate} onChange={e => updateLineItem(idx, "rate", +e.target.value)} placeholder="Rate" className={`${inp} w-28`} min={0} />
                      {invoiceForm.items.length > 1 && (
                        <button type="button" onClick={() => removeLineItem(idx)} className="text-zinc-600 hover:text-rose-400"><X className="w-4 h-4" /></button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addLineItem} className={`${btnSecondary} mt-2 text-xs`}>
                  <Plus className="w-3.5 h-3.5" /> Add Line Item
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>GST / Tax (%)</label>
                  <input type="number" value={invoiceForm.taxPercent} onChange={e => setInvoiceForm(p => ({ ...p, taxPercent: +e.target.value }))} placeholder="18" className={inp} min={0} max={100} />
                </div>
                <div>
                  <label className={lbl}>Status</label>
                  <select value={invoiceForm.status} onChange={e => setInvoiceForm(p => ({ ...p, status: e.target.value as InvoiceStatus }))} className={inp}>
                    {["Draft", "Sent", "Paid"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Totals preview */}
              <div className="bg-black/30 border border-white/[0.05] rounded-xl p-4 text-sm space-y-1">
                <div className="flex justify-between text-zinc-400"><span>Subtotal</span><span>{fmtAmt(invoiceSubtotal, invoiceForm.currency)}</span></div>
                {invoiceForm.taxPercent > 0 && <div className="flex justify-between text-zinc-400"><span>Tax ({invoiceForm.taxPercent}%)</span><span>{fmtAmt(invoiceTax, invoiceForm.currency)}</span></div>}
                <div className="flex justify-between font-bold text-[#FF6B00] text-base pt-1 border-t border-white/[0.05]"><span>Total</span><span>{fmtAmt(invoiceTotal, invoiceForm.currency)}</span></div>
              </div>

              <div>
                <label className={lbl}>Notes</label>
                <textarea value={invoiceForm.notes} onChange={e => setInvoiceForm(p => ({ ...p, notes: e.target.value }))} rows={2} placeholder="Additional notes for the client…" className={`${inp} resize-none`} />
              </div>
              <div>
                <label className={lbl}>Payment Terms</label>
                <input value={invoiceForm.paymentTerms} onChange={e => setInvoiceForm(p => ({ ...p, paymentTerms: e.target.value }))} className={inp} />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button type="submit" disabled={invoiceSaving} className={`${btnPrimary} disabled:opacity-60`}>
                  {invoiceSaving ? "Saving…" : (editInvoiceId ? "Update Invoice" : "Create Invoice")}
                </button>
                <button type="button" onClick={() => setShowInvoiceModal(false)} className={btnSecondary}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Contract Modal ── */}
      {showContractModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/[0.08] rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">{editContractId ? "Edit Contract" : "Create Contract"}</h2>
              <button onClick={() => setShowContractModal(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={saveContract} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Client *</label>
                  <select required value={contractForm.clientId} onChange={e => setContractForm(p => ({ ...p, clientId: e.target.value }))} className={inp}>
                    <option value="">Select client…</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ""}</option>)}
                  </select>
                </div>
                <div>
                  <label className={lbl}>Currency</label>
                  <select value={contractForm.currency} onChange={e => setContractForm(p => ({ ...p, currency: e.target.value as "INR" | "USD" }))} className={inp}>
                    <option value="INR">INR (₹ Indian Rupee)</option>
                    <option value="USD">USD ($ US Dollar)</option>
                  </select>
                </div>
                <div>
                  <label className={lbl}>Contract Date</label>
                  <input type="date" value={contractForm.date} onChange={e => setContractForm(p => ({ ...p, date: e.target.value }))} className={inp} />
                </div>
                <div>
                  <label className={lbl}>Total Amount</label>
                  <input type="number" value={contractForm.totalAmount} onChange={e => setContractForm(p => ({ ...p, totalAmount: +e.target.value }))} placeholder="150000" className={inp} min={0} />
                </div>
                <div>
                  <label className={lbl}>Start Date</label>
                  <input type="date" value={contractForm.startDate} onChange={e => setContractForm(p => ({ ...p, startDate: e.target.value }))} className={inp} />
                </div>
                <div>
                  <label className={lbl}>End Date</label>
                  <input type="date" value={contractForm.endDate} onChange={e => setContractForm(p => ({ ...p, endDate: e.target.value }))} className={inp} />
                </div>
                <div>
                  <label className={lbl}>Duration</label>
                  <input value={contractForm.duration} onChange={e => setContractForm(p => ({ ...p, duration: e.target.value }))} placeholder="3 months" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Revision Rounds</label>
                  <input type="number" value={contractForm.revisions} onChange={e => setContractForm(p => ({ ...p, revisions: +e.target.value }))} className={inp} min={0} />
                </div>
              </div>
              <div>
                <label className={lbl}>Payment Schedule</label>
                <input value={contractForm.paymentSchedule} onChange={e => setContractForm(p => ({ ...p, paymentSchedule: e.target.value }))} placeholder="50% advance, 50% on delivery" className={inp} />
              </div>
              <div>
                <label className={lbl}>Project Description / Scope of Work</label>
                <textarea required value={contractForm.projectDescription} onChange={e => setContractForm(p => ({ ...p, projectDescription: e.target.value }))} rows={4} placeholder="Describe the full scope of work, deliverables, and requirements…" className={`${inp} resize-none`} />
              </div>
              <div>
                <label className={lbl}>Custom Terms & Conditions (Optional)</label>
                <textarea value={contractForm.customTerms || ""} onChange={e => setContractForm(p => ({ ...p, customTerms: e.target.value }))} rows={4} placeholder="Override standard legal terms for this specific contract…" className={`${inp} resize-none`} />
              </div>
              <div>
                <label className={lbl}>Status</label>
                <select value={contractForm.status} onChange={e => setContractForm(p => ({ ...p, status: e.target.value as ContractStatus }))} className={inp}>
                  {["Draft", "Sent", "Signed"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button type="submit" disabled={contractSaving} className={`${btnPrimary} disabled:opacity-60`}>
                  {contractSaving ? "Saving…" : (editContractId ? "Update Contract" : "Create Contract")}
                </button>
                <button type="button" onClick={() => setShowContractModal(false)} className={btnSecondary}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── BLOG EDITOR OVERLAY (Full Screen) ── */}
      {showBlogEditor && (
        <div className="fixed inset-0 z-50 bg-[#050505] overflow-y-auto">
          <div className="max-w-5xl mx-auto py-12 px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">{editBlogId ? "Edit Post" : "New Post"}</h2>
              <button onClick={() => setShowBlogEditor(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-8 h-8" />
              </button>
            </div>
            <form onSubmit={saveBlog} className="space-y-8">
              {/* Basic Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={lbl}>Title</label>
                  <input required value={blogForm.title} onChange={e => setBlogForm(p => ({ ...p, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') }))} className={inp} placeholder="The Future of AI" />
                </div>
                <div>
                  <label className={lbl}>Slug</label>
                  <input required value={blogForm.slug} onChange={e => setBlogForm(p => ({ ...p, slug: e.target.value }))} className={inp} placeholder="the-future-of-ai" />
                </div>
                <div>
                  <label className={lbl}>Category</label>
                  <input required value={blogForm.category} onChange={e => setBlogForm(p => ({ ...p, category: e.target.value }))} className={inp} placeholder="Engineering" />
                </div>
                <div>
                  <label className={lbl}>Author</label>
                  <input required value={blogForm.author} onChange={e => setBlogForm(p => ({ ...p, author: e.target.value }))} className={inp} placeholder="Md Arsalan" />
                </div>
                <div>
                  <label className={lbl}>Publish Date (Schedule)</label>
                  <input type="date" required value={blogForm.publishDate} onChange={e => setBlogForm(p => ({ ...p, publishDate: e.target.value }))} className={inp} />
                  <p className="text-xs text-zinc-500 mt-1">Set to a future date to schedule publication automatically.</p>
                </div>
                <div>
                  <label className={lbl}>Cover Image URL</label>
                  <input value={blogForm.coverImage} onChange={e => setBlogForm(p => ({ ...p, coverImage: e.target.value }))} className={inp} placeholder="https://..." />
                </div>
              </div>

              <div>
                <label className={lbl}>Excerpt (Short Description)</label>
                <textarea required value={blogForm.excerpt} onChange={e => setBlogForm(p => ({ ...p, excerpt: e.target.value }))} rows={3} className={`${inp} resize-none`} placeholder="A brief summary of the article..." />
              </div>

              {/* Rich Text Editor */}
              <div className="bg-white rounded-xl text-black overflow-hidden">
                <ReactQuill 
                  theme="snow" 
                  value={blogForm.content} 
                  onChange={content => setBlogForm(p => ({ ...p, content }))} 
                  className="h-[400px] pb-10"
                />
              </div>

              {/* FAQs Section */}
              <div className="bg-[#111111] border border-white/[0.05] p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">Frequently Asked Questions (SEO)</h3>
                    <p className="text-sm text-zinc-500">Adding FAQs will generate JSON-LD schema for Google's AI Overviews.</p>
                  </div>
                  <button type="button" onClick={() => setBlogForm(p => ({ ...p, faqs: [...p.faqs, { question: "", answer: "" }] }))} className={btnSecondary}>
                    <Plus className="w-4 h-4" /> Add FAQ
                  </button>
                </div>
                <div className="space-y-4">
                  {blogForm.faqs.map((faq, i) => (
                    <div key={i} className="flex gap-4 items-start bg-white/[0.02] p-4 rounded-xl border border-white/[0.02]">
                      <div className="flex-1 space-y-3">
                        <input required value={faq.question} onChange={e => {
                          const newFaqs = [...blogForm.faqs];
                          newFaqs[i].question = e.target.value;
                          setBlogForm(p => ({ ...p, faqs: newFaqs }));
                        }} placeholder="Question" className={inp} />
                        <textarea required value={faq.answer} onChange={e => {
                          const newFaqs = [...blogForm.faqs];
                          newFaqs[i].answer = e.target.value;
                          setBlogForm(p => ({ ...p, faqs: newFaqs }));
                        }} placeholder="Answer" rows={2} className={`${inp} resize-none`} />
                      </div>
                      <button type="button" onClick={() => {
                        const newFaqs = blogForm.faqs.filter((_, idx) => idx !== i);
                        setBlogForm(p => ({ ...p, faqs: newFaqs }));
                      }} className="text-zinc-500 hover:text-rose-400 mt-2">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {blogForm.faqs.length === 0 && <div className="text-zinc-600 text-sm">No FAQs added yet.</div>}
                </div>
              </div>

              {/* Save/Publish */}
              <div className="flex items-center gap-4 pt-6 border-t border-white/[0.05]">
                <button type="submit" disabled={blogSaving} className={btnPrimary}>
                  {blogSaving ? "Saving..." : (editBlogId ? "Update Post" : "Publish / Schedule")}
                </button>
                <button type="button" onClick={() => setShowBlogEditor(false)} className={btnSecondary}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
