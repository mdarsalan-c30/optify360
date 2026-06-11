"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  deleteDoc, 
  doc 
} from "firebase/firestore";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { 
  Lock, 
  Mail, 
  LogOut, 
  Briefcase, 
  MailWarning, 
  Trash2, 
  Search, 
  UserCheck, 
  Calendar, 
  Filter,
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Auth Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccessMsg, setAuthSuccessMsg] = useState("");

  // Dashboard State
  const [leads, setLeads] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"leads" | "contacts">("leads");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Leads and Contacts in real-time when authenticated
  useEffect(() => {
    if (!user) return;

    const leadsQuery = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const unsubscribeLeads = onSnapshot(leadsQuery, (snapshot) => {
      const leadsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLeads(leadsList);
    }, (err) => {
      console.error("Error fetching leads:", err);
    });

    const contactsQuery = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
    const unsubscribeContacts = onSnapshot(contactsQuery, (snapshot) => {
      const contactsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContacts(contactsList);
    }, (err) => {
      console.error("Error fetching contacts:", err);
    });

    return () => {
      unsubscribeLeads();
      unsubscribeContacts();
    };
  }, [user]);

  // Auth Handlers
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccessMsg("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setAuthError(err.message || "Failed to sign in. Check credentials.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccessMsg("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setAuthSuccessMsg("Account registered and signed in!");
      setIsRegistering(false);
    } catch (err: any) {
      setAuthError(err.message || "Failed to create account.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  // Entry Management
  const handleDeleteEntry = async (id: string, collectionName: "leads" | "contacts") => {
    if (!window.confirm(`Are you sure you want to delete this ${collectionName === "leads" ? "lead" : "submission"}?`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Failed to delete entry. Check Firestore rules.");
    }
  };

  // Searching and Filtering Logic
  const filteredLeads = leads.filter((item) => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.projectType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === "all") return matchesSearch;
    return matchesSearch && item.projectType?.toLowerCase().includes(filterType.toLowerCase());
  });

  const filteredContacts = contacts.filter((item) => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.service?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message?.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === "all") return matchesSearch;
    return matchesSearch && item.service?.toLowerCase().includes(filterType.toLowerCase());
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-black text-brand-text">
        <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render Login Panel if not logged in
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-black px-6 py-12 relative overflow-hidden font-sans">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-orange/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="w-full max-w-md bg-brand-surface/80 border border-brand-text/5 p-8 rounded-2xl backdrop-blur-md shadow-2xl relative z-10">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="flex items-center gap-1 text-xs text-brand-muted hover:text-brand-orange transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Site
            </Link>
            <span className="text-xs font-mono text-brand-orange tracking-widest uppercase">Admin System</span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-brand-text tracking-tight mb-2">BLACKHOLE</h1>
            <p className="text-sm text-brand-muted">
              {isRegistering ? "Register administrative access credentials" : "Authenticate to access client telemetry"}
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-400 text-xs flex items-center gap-2">
              <MailWarning className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccessMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 text-xs flex items-center gap-2">
              <UserCheck className="w-4 h-4 flex-shrink-0" />
              <span>{authSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={isRegistering ? handleRegister : handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-brand-muted uppercase mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@blackhole.com"
                  className="w-full bg-brand-black/80 border border-brand-text/10 rounded-lg pl-10 pr-4 py-3 text-sm text-brand-text focus:outline-none focus:border-brand-orange transition-colors"
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-muted" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-brand-muted uppercase mb-2">Security Key (Password)</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-brand-black/80 border border-brand-text/10 rounded-lg pl-10 pr-4 py-3 text-sm text-brand-text focus:outline-none focus:border-brand-orange transition-colors"
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-muted" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-brand-orange hover:bg-brand-dark-orange text-brand-black font-semibold text-sm transition-colors cursor-pointer mt-2"
            >
              {isRegistering ? "Create System Account" : "Access Terminal"}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-brand-text/5 pt-4">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setAuthError("");
                setAuthSuccessMsg("");
              }}
              className="text-xs text-brand-orange hover:underline cursor-pointer"
            >
              {isRegistering 
                ? "Already have an account? Access Terminal" 
                : "Register New Administrative Account"
              }
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Admin Dashboard when authenticated
  return (
    <div className="min-h-screen bg-brand-black text-brand-text font-sans flex flex-col">
      {/* Top Banner */}
      <header className="border-b border-brand-text/5 bg-brand-surface/40 backdrop-blur px-6 py-4 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-bold tracking-tighter flex items-center gap-1.5 hover:text-brand-orange transition-colors">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-orange" />
              <span>BLACKHOLE</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-brand-muted" />
            <span className="text-xs font-mono bg-brand-surface border border-brand-text/10 text-brand-orange px-2 py-0.5 rounded">
              ADMIN CONTROL HUB
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-brand-muted font-mono hidden md:inline">
              Authenticated: {user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-900/30 bg-rose-950/20 text-rose-400 hover:bg-rose-950/40 text-xs font-semibold cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Panel Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-10 md:px-12 lg:px-24">
        {/* Navigation Tabs and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10 items-end">
          <div className="md:col-span-6 flex gap-2">
            <button
              onClick={() => {
                setActiveTab("leads");
                setFilterType("all");
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm transition-all cursor-pointer ${
                activeTab === "leads"
                  ? "bg-brand-orange text-brand-black"
                  : "bg-brand-surface/50 border border-brand-text/5 text-brand-muted hover:text-brand-text"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Project Leads ({leads.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("contacts");
                setFilterType("all");
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm transition-all cursor-pointer ${
                activeTab === "contacts"
                  ? "bg-brand-orange text-brand-black"
                  : "bg-brand-surface/50 border border-brand-text/5 text-brand-muted hover:text-brand-text"
              }`}
            >
              <Mail className="w-4 h-4" />
              Contact Inbox ({contacts.length})
            </button>
          </div>

          {/* Search/Filter Bar */}
          <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, email, details..."
                className="w-full bg-brand-surface/50 border border-brand-text/10 rounded-lg pl-9 pr-4 py-2.5 text-xs text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-orange"
              />
              <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-brand-muted" />
            </div>

            <div className="relative flex items-center">
              <Filter className="absolute left-3 w-3.5 h-3.5 text-brand-muted" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-brand-surface/50 border border-brand-text/10 rounded-lg pl-9 pr-4 py-2.5 text-xs text-brand-text focus:outline-none focus:border-brand-orange appearance-none cursor-pointer"
              >
                <option value="all" className="bg-brand-surface">All Categories</option>
                {activeTab === "leads" ? (
                  <>
                    <option value="web" className="bg-brand-surface">Web Application</option>
                    <option value="mobile" className="bg-brand-surface">Mobile App</option>
                    <option value="ai" className="bg-brand-surface">AI & Automation</option>
                    <option value="design" className="bg-brand-surface">Design System</option>
                  </>
                ) : (
                  <>
                    <option value="development" className="bg-brand-surface">Web Development</option>
                    <option value="ai" className="bg-brand-surface">AI Workflows</option>
                    <option value="design" className="bg-brand-surface">Design Systems</option>
                    <option value="general" className="bg-brand-surface">General Inquiry</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Lead List View */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            {filteredLeads.length === 0 ? (
              <div className="text-center py-20 bg-brand-surface/20 border border-brand-text/5 rounded-2xl">
                <Briefcase className="w-12 h-12 text-brand-muted mx-auto mb-4 opacity-50" />
                <p className="text-brand-muted text-sm">No leads match your selection criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredLeads.map((lead) => (
                  <div 
                    key={lead.id} 
                    className="p-6 rounded-xl bg-brand-surface/40 border border-brand-text/5 hover:border-brand-orange/20 transition-all group"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-brand-text">{lead.name}</h3>
                          {lead.company && (
                            <span className="text-xs bg-brand-text/5 px-2 py-0.5 rounded text-brand-muted font-mono">
                              {lead.company}
                            </span>
                          )}
                          <span className="text-xs bg-brand-orange/10 border border-brand-orange/20 px-2 py-0.5 rounded text-brand-orange font-mono">
                            {lead.projectType}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-brand-muted font-mono">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-brand-orange" />
                            <a href={`mailto:${lead.email}`} className="hover:underline text-brand-text">
                              {lead.email}
                            </a>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : "Date N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                          <div className="text-xs text-brand-muted font-mono">ESTIMATION:</div>
                          <div className="text-sm font-bold text-brand-orange font-mono">{lead.budget}</div>
                          <div className="text-xs text-brand-muted font-mono">Timeline: {lead.timeline}</div>
                        </div>

                        <button
                          onClick={() => handleDeleteEntry(lead.id, "leads")}
                          className="p-2 rounded-lg bg-brand-black border border-brand-text/5 text-brand-muted hover:text-rose-400 hover:border-rose-950 transition-colors cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-brand-text/5">
                      <div className="text-xs text-brand-muted font-mono uppercase mb-2">Scope Specifications:</div>
                      <p className="text-sm text-brand-text whitespace-pre-wrap font-sans bg-brand-black/30 p-3 rounded border border-brand-text/5 leading-relaxed">
                        {lead.details || "No details specified."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contact List View */}
        {activeTab === "contacts" && (
          <div className="space-y-4">
            {filteredContacts.length === 0 ? (
              <div className="text-center py-20 bg-brand-surface/20 border border-brand-text/5 rounded-2xl">
                <Mail className="w-12 h-12 text-brand-muted mx-auto mb-4 opacity-50" />
                <p className="text-brand-muted text-sm">No contact inquiries match your selection criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredContacts.map((contact) => (
                  <div 
                    key={contact.id} 
                    className="p-6 rounded-xl bg-brand-surface/40 border border-brand-text/5 hover:border-brand-orange/20 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-brand-text">{contact.name}</h3>
                          {contact.company && (
                            <span className="text-xs bg-brand-text/5 px-2 py-0.5 rounded text-brand-muted font-mono">
                              {contact.company}
                            </span>
                          )}
                          <span className="text-xs bg-brand-text/10 border border-brand-text/10 px-2 py-0.5 rounded text-brand-muted font-mono">
                            {contact.service}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-brand-muted font-mono">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-brand-orange" />
                            <a href={`mailto:${contact.email}`} className="hover:underline text-brand-text">
                              {contact.email}
                            </a>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {contact.createdAt ? new Date(contact.createdAt).toLocaleString() : "Date N/A"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <button
                          onClick={() => handleDeleteEntry(contact.id, "contacts")}
                          className="p-2 rounded-lg bg-brand-black border border-brand-text/5 text-brand-muted hover:text-rose-400 hover:border-rose-950 transition-colors cursor-pointer"
                          title="Delete Contact"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-brand-text/5">
                      <div className="text-xs text-brand-muted font-mono uppercase mb-2">Message Body:</div>
                      <p className="text-sm text-brand-text whitespace-pre-wrap font-sans bg-brand-black/30 p-3 rounded border border-brand-text/5 leading-relaxed">
                        {contact.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
