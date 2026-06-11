"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { 
  collection, 
  query, 
  getDocs, 
  orderBy, 
  addDoc, 
  updateDoc,
  deleteDoc,
  doc, 
  serverTimestamp 
} from "firebase/firestore";
// Removed Firebase storage import; using Cloudinary for image uploads
import { 
  KeyRound, RefreshCw, LogOut, Mail, User, Phone, 
  Briefcase, FileText, Calendar, Database, Search, 
  Plus, Edit, Trash2, X, CheckCircle, DatabaseZap, Trash, ShieldCheck,
  LayoutGrid, Cpu, Code, Sparkles, Terminal, BarChart2, Zap
} from "lucide-react";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  // Data Lists
  const [contacts, setContacts] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"inquiries" | "blogs" | "portfolio" | "testimonials" | "services">("inquiries");
  const [activeSubTab, setActiveSubTab] = useState<"contacts" | "leads">("contacts");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form Editor Modal States
  const [editorType, setEditorType] = useState<"blog" | "project" | "testimonial" | "service" | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Forms inputs
  const [blogForm, setBlogForm] = useState({
    title: "", slug: "", category: "", excerpt: "", content: "", coverImage: "", author: "Md Arsalan"
  });
  const [projectForm, setProjectForm] = useState({
    client: "", category: "", title: "", challenge: "", solution: "", techStack: "", outcome: "", metric: "", gradient: ""
  });
  const [testimonialForm, setTestimonialForm] = useState({
    author: "", role: "", company: "", quote: "", avatarGradient: ""
  });
  const [serviceForm, setServiceForm] = useState({
    name: "", headline: "", description: "", pillars: "", iconName: "Code"
  });

  // Authenticate session on mount using Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        fetchData();
      } else {
        setIsLoggedIn(false);
        clearData();
      }
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle setting isLoggedIn and fetching data
    } catch (err: any) {
      console.error("Firebase login error:", err);
      setLoginError("Invalid admin email or password.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    // onAuthStateChanged will handle clearing state
  };

  const clearData = () => {
    setContacts([]);
    setLeads([]);
    setBlogs([]);
    setProjects([]);
    setTestimonials([]);
    setServices([]);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch contacts
      const contactsSnapshot = await getDocs(query(collection(db, "contacts"), orderBy("createdAt", "desc")));
      setContacts(contactsSnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data, createdAt: data.createdAt?.toDate() || new Date() };
      }));

      // 2. Fetch leads
      const leadsSnapshot = await getDocs(query(collection(db, "leads"), orderBy("createdAt", "desc")));
      setLeads(leadsSnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data, createdAt: data.createdAt?.toDate() || new Date() };
      }));

      // 3. Fetch blogs
      const blogsSnapshot = await getDocs(query(collection(db, "blogs"), orderBy("createdAt", "desc")));
      setBlogs(blogsSnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data, createdAt: data.createdAt?.toDate() || new Date() };
      }));

      // 4. Fetch projects
      const projectsSnapshot = await getDocs(query(collection(db, "projects"), orderBy("createdAt", "desc")));
      setProjects(projectsSnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data, createdAt: data.createdAt?.toDate() || new Date() };
      }));

      // 5. Fetch testimonials
      const testimonialsSnapshot = await getDocs(query(collection(db, "testimonials"), orderBy("createdAt", "desc")));
      setTestimonials(testimonialsSnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data, createdAt: data.createdAt?.toDate() || new Date() };
      }));

      // 6. Fetch services
      const servicesSnapshot = await getDocs(query(collection(db, "services"), orderBy("createdAt", "asc")));
      setServices(servicesSnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data, createdAt: data.createdAt?.toDate() || new Date() };
      }));

    } catch (err) {
      console.error("Error loading admin collections from Firestore:", err);
    } finally {
      setLoading(false);
    }
  };

  // Close modals
  const closeEditor = () => {
    setEditorType(null);
    setEditId(null);
    setBlogForm({ title: "", slug: "", category: "", excerpt: "", content: "", coverImage: "", author: "Md Arsalan" });
    setProjectForm({ client: "", category: "", title: "", challenge: "", solution: "", techStack: "", outcome: "", metric: "", gradient: "" });
    setTestimonialForm({ author: "", role: "", company: "", quote: "", avatarGradient: "" });
    setServiceForm({ name: "", headline: "", description: "", pillars: "", iconName: "Code" });
  };

  // Upload blog image to Firebase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'optify360');
      formData.append('folder', 'optify360/images');
      const res = await fetch('https://api.cloudinary.com/v1_1/dakusigxm/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setBlogForm(prev => ({ ...prev, coverImage: data.secure_url }));
        showNotification('Image uploaded successfully via Cloudinary.');
      } else {
        console.error('Cloudinary upload error:', data);
        alert('Failed to upload image via Cloudinary.');
      }
    } catch (err) {
      console.error('Error uploading image to Cloudinary:', err);
      alert('Failed to upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  // Submit Blog Form
  const saveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        const docRef = doc(db, "blogs", editId);
        await updateDoc(docRef, { ...blogForm, updatedAt: serverTimestamp() });
        showNotification("Blog post updated successfully.");
      } else {
        await addDoc(collection(db, "blogs"), {
          ...blogForm,
          createdAt: serverTimestamp(),
          date: new Date().toLocaleDateString()
        });
        showNotification("Blog post created successfully.");
      }
      closeEditor();
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to save blog post.");
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Project Form
  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        const docRef = doc(db, "projects", editId);
        await updateDoc(docRef, { ...projectForm, updatedAt: serverTimestamp() });
        showNotification("Project case study updated.");
      } else {
        await addDoc(collection(db, "projects"), {
          ...projectForm,
          createdAt: serverTimestamp()
        });
        showNotification("Project case study created.");
      }
      closeEditor();
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to save project.");
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Testimonial Form
  const saveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        const docRef = doc(db, "testimonials", editId);
        await updateDoc(docRef, { ...testimonialForm, updatedAt: serverTimestamp() });
        showNotification("Testimonial review updated.");
      } else {
        await addDoc(collection(db, "testimonials"), {
          ...testimonialForm,
          createdAt: serverTimestamp()
        });
        showNotification("Testimonial review created.");
      }
      closeEditor();
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to save testimonial.");
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Service Form
  const saveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        const docRef = doc(db, "services", editId);
        await updateDoc(docRef, { ...serviceForm, updatedAt: serverTimestamp() });
        showNotification("Service updated.");
      } else {
        await addDoc(collection(db, "services"), {
          ...serviceForm,
          createdAt: serverTimestamp()
        });
        showNotification("Service created.");
      }
      closeEditor();
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to save service.");
    } finally {
      setSubmitting(false);
    }
  };

  // Generic Delete
  const handleDelete = async (colName: string, id: string) => {
    if (!window.confirm(`Are you sure you want to delete this item from the ${colName} collection?`)) return;
    try {
      await deleteDoc(doc(db, colName, id));
      showNotification("Item deleted successfully.");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete item.");
    }
  };

  // Seeding Database content with all premium projects, testimonials, and blogs
  const handleSeedDatabase = async () => {
    if (!window.confirm("Seed default portfolio projects, blogs, and testimonials into your Firestore database? (This will NOT overwrite existing records).")) return;
    setSeeding(true);
    try {
      // 1. Projects Data
      const defaultProjects = [
        {
          client: "StudyCubs",
          category: "EdTech • Learning Platform • Skill Development",
          title: "Online learning platform focused on future-ready skills",
          url: "https://studycubs.com",
          challenge: "Traditional education often overlooks communication, confidence building, public speaking, and practical life skills. Parents increasingly seek personalized skill-based learning environments.",
          solution: "We engineered an interactive learning platform supporting public speaking courses, coding exercises, customized sessions, and student progress tracking systems, integrating a parent-friendly onboarding funnel.",
          techStack: "React • Next.js • Firebase • Video Integration • CRM",
          outcome: "Education-focused UX, parent progress monitoring portal, automated CRM lead capture, and scalable course architecture.",
          metric: "+45% Onboarding",
          gradient: "from-amber-600/40 via-orange-900/20 to-black/80"
        },
        {
          client: "PDFVerse",
          category: "SaaS • Productivity Tool • PDF Processing",
          title: "Browser-based document productivity platform",
          url: "https://pdf-verse.vercel.app",
          challenge: "Most online PDF utilities are either expensive, require software installation, have clunky interfaces, or upload sensitive documents to external servers, risking data privacy.",
          solution: "Built a browser-first, privacy-centric utility tool executing PDF splits, merges, compressions, OCR, and page manipulation directly in browser memory using client-side JavaScript.",
          techStack: "Next.js • React • Tailwind CSS • PDF.js • Tesseract OCR • Firebase",
          outcome: "100% client-side privacy-first execution, under 1.2s Largest Contentful Paint (LCP), and robust document utility tools.",
          metric: "Zero Server Uploads",
          gradient: "from-purple-600/40 via-indigo-900/20 to-black/80"
        },
        {
          client: "Mynra",
          category: "AI SaaS • Automation • Conversational AI",
          title: "AI-powered automation and SaaS dashboard",
          url: "https://mynyra.netlify.app",
          challenge: "Ambitious businesses require automated operational workflows and conversational AI agents but lack the technical developer resources to configure LLM prompts and vector memories.",
          solution: "Developed an AI-first SaaS dashboard featuring conversational assistants, operational automation adapters, and low-latency API brokers connected to secure OpenAI backend queues.",
          techStack: "Next.js • OpenAI APIs • Firebase • Tailwind CSS • Serverless",
          outcome: "Autonomous operational agents, dynamic memory state routing, and responsive dashboard experience.",
          metric: "-80% Support Cost",
          gradient: "from-blue-600/40 via-cyan-900/20 to-black/80"
        },
        {
          client: "ClimateVerse",
          category: "ClimateTech • Sustainability • Interactive Platform",
          title: "Environmental awareness & carbon footprint toolkit",
          challenge: "Most environmental and climate websites rely on static articles, providing little interactivity or actionable calculations to engage users in sustainability.",
          solution: "Designed and engineered an environmental utility platform offering footprint calculators, sustainability pledge trackers, and educational content databases.",
          techStack: "Next.js • Firebase • Tailwind CSS • Chart Libraries • Eco APIs",
          outcome: "Educational yet interactive carbon calculators, sustainability metrics, and dynamic SEO content structures.",
          metric: "+60% Session Engagement",
          gradient: "from-emerald-600/40 via-teal-900/20 to-black/80"
        },
        {
          client: "Epic India Travel",
          category: "TravelTech • Tourism • Content Platform",
          title: "Indian destination discovery & tour booking portal",
          url: "http://epicindiatravel.iin",
          challenge: "Many travel planning websites overload visitors with slow loading catalogs, poor navigation structures, and high friction booking forms.",
          solution: "Created a destination-focused portal featuring fast travel packages, program catalogs, optimized search indexing, and a simple lead capture database.",
          techStack: "Next.js • Tailwind CSS • Firebase • Headless CMS",
          outcome: "Zero-latency travel catalog, highly optimized SEO structural schemas, and clean database leads logging.",
          metric: "+120% SEO Visibility",
          gradient: "from-rose-600/40 via-red-900/20 to-black/80"
        }
      ];

      for (const proj of defaultProjects) {
        // Only write if doesn't exist already in current list
        const exists = projects.some(p => p.client === proj.client);
        if (!exists) {
          await addDoc(collection(db, "projects"), {
            ...proj,
            createdAt: serverTimestamp()
          });
        }
      }

      // 2. Testimonials Data
      const defaultTestimonials = [
        {
          author: "Sarah Jenkins",
          role: "Chief Technology Officer",
          company: "Veloce Analytics",
          quote: "Optify360 didn't just build our platform; they engineered our entire growth engine. Their Next.js architectures and custom AI automation pipelines allowed us to scale to 50k monthly active users without hiring additional support reps. Their technical SEO strategy drove a 310% increase in inbound enterprise sign-ups.",
          avatarGradient: "from-orange-500 to-amber-500"
        },
        {
          author: "David Vance",
          role: "VP of Product",
          company: "ScaleFlow Systems",
          quote: "Partnering with Md Arsalan and the Optify360 team was a game-changer. They rebuilt our legacy web app from scratch, boosting speed by 250% and conversion rate by 42%. They operate as a strategic business partner, not a dev shop.",
          avatarGradient: "from-blue-500 to-indigo-500"
        },
        {
          author: "Elena Rostova",
          role: "Founder & CEO",
          company: "Novus HR",
          quote: "Optify360 delivered a top-tier brand identity and a lightning-fast headless website in record time. Their technical SEO knowledge is unmatched—within 90 days, we were ranking #1 for three of our highest-value enterprise keywords.",
          avatarGradient: "from-pink-500 to-rose-500"
        }
      ];

      for (const test of defaultTestimonials) {
        const exists = testimonials.some(t => t.author === test.author);
        if (!exists) {
          await addDoc(collection(db, "testimonials"), {
            ...test,
            createdAt: serverTimestamp()
          });
        }
      }

      // 3. Blogs Data
      const defaultBlogs = [
        {
          title: "The B2B SaaS SEO Playbook: Scaling Organic Pipelines Without Fluff",
          slug: "seo-strategies-for-saas-scaling",
          category: "SEO & Growth",
          author: "Md Arsalan",
          excerpt: "Learn the exact technical and semantic SEO strategies top-tier SaaS companies use to capture high-intent buyers and scale organic demo registrations.",
          coverImage: "/images/blog/saas-seo-playbook.jpg",
          content: `Many B2B SaaS companies treat SEO as a volume game. They publish dozens of shallow, top-of-funnel articles targeting high-volume keywords, hoping that traffic will convert into customers. The result is high traffic, low conversions, and wasted budget.

To build an organic acquisition channel that directly drives pipelines and demo signups, focus on **search intent** and **technical performance**.

## 1. Targeting Product-Led Search Intent (BOFU)
High-intent keywords exist at the bottom of the funnel (BOFU). Focus on:
*   **Alternatives & Competitor Comparison Pages:** e.g., *"Competitor alternatives"*
*   **Use-Case & Solution Pages:** Indicate specific pain points.
*   **Integration Keywords:** Indicate technical capability fit.

## 2. Technical Site Architecture & Core Web Vitals
Optimize for the three key metrics defined by Google:
1.  **LCP (Largest Contentful Paint):** Keep it under 2.5 seconds.
2.  **INP (Interaction to Next Paint):** Keep it under 200ms.
3.  **CLS (Cumulative Layout Shift):** Maintain a score under 0.1.

Use schema structured data (JSON-LD) dynamically to help indexers crawl content.`
        },
        {
          title: "Harnessing AI Automation for Streamlined Business Operations",
          slug: "harnessing-ai-automation-for-operations",
          category: "AI Automation",
          author: "Md Arsalan",
          excerpt: "How custom LLM agents, LangChain workflows, and RAG architectures automate repetitive administrative work and scale business output.",
          coverImage: "/images/blog/ai-automation.jpg",
          content: `In modern operations, manual bottlenecks represent substantial overhead. By designing custom LLM agents and linking databases together, workflows run autonomously.

## 1. Custom Cognitive LLM Agents
We use LangChain or LlamaIndex to structure workflows. Cognitive agents can:
*   Read and categorize client emails automatically.
*   Perform RAG search to answer customer inquiries.
*   Log structured details directly in CRM databases.

## 2. decouping tasks via queues
Avoid timeout limits by routing operations asynchronously. This ensures client dashboards load instantaneously.`
        },
        {
          title: "Building Scalable SaaS Architectures: Next.js, APIs, and Secure Databases",
          slug: "building-scalable-saas-architectures",
          category: "SaaS Development",
          author: "Md Arsalan",
          excerpt: "Deep dive into building multi-tenant SaaS platforms using Next.js 15, TypeScript type-safety, secure PostgreSQL schemas, and decoupled API architectures.",
          coverImage: "/images/blog/saas-architecture.jpg",
          content: `Engineering multi-tenant applications requires scoping security and data isolation constraints early in the cycle.

## 1. Decentralized Database Clusters
Use database row-level security (RLS) to restrict tenants from reading other accounts' data. This is critical for HIPAA and GDPR compliance.

## 2. Decoupled Next.js Frontends
Keep API brokers decoupled from the client. NextJS 15 Server Components allow executing queries securely without exposing variables.`
        }
      ];

      for (const b of defaultBlogs) {
        const exists = blogs.some(x => x.slug === b.slug);
        if (!exists) {
          await addDoc(collection(db, "blogs"), {
            ...b,
            createdAt: serverTimestamp(),
            date: new Date().toLocaleDateString()
          });
        }
      }

      // 4. Services Data
      const defaultServices = [
        {
          name: "Enterprise SaaS & Web App Engineering",
          headline: "Scalable, secure, and production-ready applications built to perform.",
          description: "We engineer cloud-native, multi-tenant software architectures that handle heavy workloads and offer flawless user experiences. Custom-built with React, Next.js, and TypeScript.",
          pillars: "Full-Stack Next.js, Advanced APIs, Secure DB Setup",
          iconName: "Code"
        },
        {
          name: "Technical SEO Optimization",
          headline: "Dominate high-intent search queries. Turn traffic into revenue.",
          description: "Fast search engine rankings through clean indexable structure, automated page generation, and schema tags. Focus on bottom-of-funnel conversion queries.",
          pillars: "Core Web Vitals, Programmatic SEO, JSON-LD Schema",
          iconName: "Zap"
        },
        {
          name: "Intelligent AI Workflows",
          headline: "Automate manual overhead. Scale operations with custom AI workflows.",
          description: "Automate manual operational overhead with custom AI agent pipelines, LLM integrations (Claude/OpenAI), and Retrieval-Augmented Generation (RAG) database connections.",
          pillars: "AI Agent Pipelines, CRM Automation, Cognitive Search",
          iconName: "Cpu"
        },
        {
          name: "Headless Web Development",
          headline: "Ultra-fast, responsive web interfaces built for high conversions.",
          description: "Your website is your storefront. We build headless sites via Sanity, Strapi, or Contentful that guarantee under 1.2s loading speeds and 100/100 Lighthouse scores.",
          pillars: "Under 1.2s Load Times, Headless CMS Connectors, WCAG Accessible",
          iconName: "Terminal"
        },
        {
          name: "Strategic Brand Identity",
          headline: "Establish authority with a visual identity that commands premium pricing.",
          description: "A premium service needs premium branding. We craft digital brand guidelines, typography, color palettes, and full Figma design libraries.",
          pillars: "Positioning Strategy, Logo & Assets System, Figma Design Libraries",
          iconName: "Sparkles"
        },
        {
          name: "Growth Systems & CRO",
          headline: "Maximize your pipeline. Transform traffic into revenue.",
          description: "We engineer high-converting sales funnels, optimize customer journeys, and implement Mixpanel/GA4 analytics setups to track advertising attribution.",
          pillars: "A/B Conversion Testing, Attribution Analytics, Landing Page Funnels",
          iconName: "BarChart2"
        }
      ];

      for (const s of defaultServices) {
        const exists = services.some(x => x.name === s.name);
        if (!exists) {
          await addDoc(collection(db, "services"), {
            ...s,
            createdAt: serverTimestamp()
          });
        }
      }

      showNotification("Database seeded successfully with all premium defaults!");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to seed database.");
    } finally {
      setSeeding(false);
    }
  };

  // Clear all dynamic data from Firestore (Projects, Blogs, Testimonials, Services)
  const handleClearDatabase = async () => {
    if (!window.confirm("WARNING: This will permanently delete all blogs, projects, testimonials, and services from your Firestore database. Proceed?")) return;
    setSeeding(true);
    try {
      // Clear projects
      const projSnap = await getDocs(collection(db, "projects"));
      for (const d of projSnap.docs) {
        await deleteDoc(doc(db, "projects", d.id));
      }
      
      // Clear blogs
      const blogSnap = await getDocs(collection(db, "blogs"));
      for (const d of blogSnap.docs) {
        await deleteDoc(doc(db, "blogs", d.id));
      }

      // Clear testimonials
      const testSnap = await getDocs(collection(db, "testimonials"));
      for (const d of testSnap.docs) {
        await deleteDoc(doc(db, "testimonials", d.id));
      }

      // Clear services
      const servSnap = await getDocs(collection(db, "services"));
      for (const d of servSnap.docs) {
        await deleteDoc(doc(db, "services", d.id));
      }

      showNotification("Database cleared successfully!");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to clear database.");
    } finally {
      setSeeding(false);
    }
  };

  // Populate Forms for Editing
  const startEdit = (type: "blog" | "project" | "testimonial" | "service", item: any) => {
    setEditId(item.id);
    setEditorType(type);
    if (type === "blog") {
      setBlogForm({
        title: item.title || "",
        slug: item.slug || "",
        category: item.category || "",
        excerpt: item.excerpt || "",
        content: item.content || "",
        coverImage: item.coverImage || "",
        author: item.author || "Md Arsalan"
      });
    } else if (type === "project") {
      setProjectForm({
        client: item.client || "",
        category: item.category || "",
        title: item.title || "",
        challenge: item.challenge || "",
        solution: item.solution || "",
        techStack: item.techStack || "",
        outcome: item.outcome || "",
        metric: item.metric || "",
        gradient: item.gradient || ""
      });
    } else if (type === "testimonial") {
      setTestimonialForm({
        author: item.author || "",
        role: item.role || "",
        company: item.company || "",
        quote: item.quote || "",
        avatarGradient: item.avatarGradient || ""
      });
    } else if (type === "service") {
      setServiceForm({
        name: item.name || "",
        headline: item.headline || "",
        description: item.description || "",
        pillars: Array.isArray(item.pillars) ? item.pillars.join(", ") : (item.pillars || ""),
        iconName: item.iconName || "Code"
      });
    }
  };

  // Search filter
  const filteredContacts = contacts.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.service?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLeads = leads.filter(l => l.email?.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredBlogs = blogs.filter(b => b.title?.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredProjects = projects.filter(p => p.client?.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredTestimonials = testimonials.filter(t => t.author?.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredServices = services.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.headline?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#050505] text-[#F5F5F5] flex items-center justify-center p-6">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#FF6B00]/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="w-full max-w-md bg-[#111111] border border-white/[0.08] rounded-2xl p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00] mx-auto mb-4">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold font-heading">Optify360 Admin</h1>
            <p className="text-sm text-[#A0A0A0] mt-1">Provide secure credentials to enter dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@optify360.com"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#FF6B00]/40 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#A0A0A0] mb-2">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#FF6B00]/40 outline-none transition-colors"
              />
            </div>

            {loginError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-lg text-center font-mono">
                {loginError}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-[#FF6B00]/10 mt-2"
            >
              Sign In to Dashboard
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-[#F5F5F5] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        
        {/* Success Banner */}
        {successMsg && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#111111] border-2 border-emerald-500 text-emerald-400 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 font-semibold animate-bounce">
            <CheckCircle className="w-5 h-5" />
            {successMsg}
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.05] pb-6 gap-4">
          <div className="flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-[#FF6B00]" />
            <div>
              <span className="text-xs uppercase text-[#FF6B00] font-bold tracking-widest font-mono">Dynamic Content Manager (CMS)</span>
              <h1 className="text-3xl font-bold font-heading mt-1">Optify360 Admin</h1>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Seeding Action Panel */}
            <div className="flex bg-[#161616] border border-white/[0.05] rounded-xl p-1 gap-2">
              <button 
                onClick={handleSeedDatabase}
                disabled={seeding || loading}
                className="bg-[#FF6B00]/10 hover:bg-[#FF6B00]/25 text-[#FF6B00] border border-[#FF6B00]/20 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <DatabaseZap className="w-3.5 h-3.5" />
                {seeding ? "Syncing..." : "Seed Default Content"}
              </button>
              <button 
                onClick={handleClearDatabase}
                disabled={seeding || loading}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Trash className="w-3.5 h-3.5" />
                Clear DB
              </button>
            </div>

            <button 
              onClick={fetchData} 
              disabled={loading || seeding}
              className="inline-flex items-center justify-center border border-white/10 bg-white/[0.02] hover:bg-white/[0.07] px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Sync
            </button>
            <button 
              onClick={handleLogout}
              className="inline-flex items-center justify-center bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors gap-2"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>

        {/* Dynamic Metric Summaries */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-[#111111] border border-white/[0.06] p-4 rounded-xl">
            <span className="text-[10px] text-[#A0A0A0] uppercase tracking-wider block font-mono">Inquiries</span>
            <span className="text-2xl font-bold font-heading mt-1 block">{contacts.length}</span>
          </div>
          <div className="bg-[#111111] border border-white/[0.06] p-4 rounded-xl">
            <span className="text-[10px] text-[#A0A0A0] uppercase tracking-wider block font-mono">Newsletter</span>
            <span className="text-2xl font-bold font-heading mt-1 block">{leads.length}</span>
          </div>
          <div className="bg-[#111111] border border-white/[0.06] p-4 rounded-xl">
            <span className="text-[10px] text-[#A0A0A0] uppercase tracking-wider block font-mono">Blogs</span>
            <span className="text-2xl font-bold font-heading mt-1 block text-orange-400">{blogs.length}</span>
          </div>
          <div className="bg-[#111111] border border-white/[0.06] p-4 rounded-xl">
            <span className="text-[10px] text-[#A0A0A0] uppercase tracking-wider block font-mono">Case Studies</span>
            <span className="text-2xl font-bold font-heading mt-1 block text-blue-400">{projects.length}</span>
          </div>
          <div className="bg-[#111111] border border-white/[0.06] p-4 rounded-xl">
            <span className="text-[10px] text-[#A0A0A0] uppercase tracking-wider block font-mono">Reviews</span>
            <span className="text-2xl font-bold font-heading mt-1 block text-purple-400">{testimonials.length}</span>
          </div>
          <div className="bg-[#111111] border border-white/[0.06] p-4 rounded-xl col-span-2 md:col-span-1">
            <span className="text-[10px] text-[#A0A0A0] uppercase tracking-wider block font-mono">Services</span>
            <span className="text-2xl font-bold font-heading mt-1 block text-emerald-400">{services.length}</span>
          </div>
        </div>

        {/* Database notice if empty */}
        {blogs.length === 0 && projects.length === 0 && testimonials.length === 0 && services.length === 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-amber-500 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-text-main">Your Firestore Database is currently empty!</h4>
                <p className="text-xs text-text-muted mt-0.5">Click "Seed Default Content" to immediately copy your default portfolio projects, blogs, testimonials, and services to Firestore.</p>
              </div>
            </div>
            <button 
              onClick={handleSeedDatabase}
              className="bg-amber-500 text-black text-xs font-bold px-4 py-2.5 rounded-lg shrink-0 hover:bg-amber-400 transition-colors"
            >
              Seed Default Data Now
            </button>
          </div>
        )}

        {/* CMS Tab Navigation */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-white/[0.05] pb-4 gap-4">
          <div className="flex flex-wrap border border-white/10 rounded-xl p-1 bg-white/[0.02]">
            <button
              onClick={() => { setActiveTab("inquiries"); setSearchTerm(""); }}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                activeTab === "inquiries" ? "bg-[#FF6B00] text-white" : "text-[#A0A0A0] hover:text-[#F5F5F5]"
              }`}
            >
              Inquiries & Leads
            </button>
            <button
              onClick={() => { setActiveTab("blogs"); setSearchTerm(""); }}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                activeTab === "blogs" ? "bg-[#FF6B00] text-white" : "text-[#A0A0A0] hover:text-[#F5F5F5]"
              }`}
            >
              Blog Manager
            </button>
            <button
              onClick={() => { setActiveTab("portfolio"); setSearchTerm(""); }}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                activeTab === "portfolio" ? "bg-[#FF6B00] text-white" : "text-[#A0A0A0] hover:text-[#F5F5F5]"
              }`}
            >
              Portfolio Case Studies
            </button>
            <button
              onClick={() => { setActiveTab("testimonials"); setSearchTerm(""); }}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                activeTab === "testimonials" ? "bg-[#FF6B00] text-white" : "text-[#A0A0A0] hover:text-[#F5F5F5]"
              }`}
            >
              Client Testimonials
            </button>
            <button
              onClick={() => { setActiveTab("services"); setSearchTerm(""); }}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                activeTab === "services" ? "bg-[#FF6B00] text-white" : "text-[#A0A0A0] hover:text-[#F5F5F5]"
              }`}
            >
              Services Manager
            </button>
          </div>

          {/* Search and Action */}
          <div className="flex items-center gap-3 w-full md:max-w-md md:justify-end">
            <div className="relative flex-grow max-w-sm">
              <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3 top-3.5" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search database..."
                className="w-full bg-[#111111] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 transition-colors"
              />
            </div>
            {activeTab !== "inquiries" && (
              <button 
                onClick={() => setEditorType(activeTab === "blogs" ? "blog" : activeTab === "portfolio" ? "project" : activeTab === "services" ? "service" : "testimonial")}
                className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-semibold text-xs px-4 py-3 rounded-xl flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            )}
          </div>
        </div>

        {/* Lists output */}
        {loading ? (
          <div className="py-20 text-center text-[#A0A0A0] font-mono text-xs flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#FF6B00]" />
            Updating Firestore connection...
          </div>
        ) : activeTab === "inquiries" ? (
          /* Sub-tabs Contacts vs Leads */
          <div className="space-y-6">
            <div className="flex border border-white/10 rounded-xl p-1 bg-white/[0.01] self-start w-72">
              <button 
                onClick={() => setActiveSubTab("contacts")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                  activeSubTab === "contacts" ? "bg-white/[0.05] text-[#FF6B00]" : "text-[#A0A0A0]"
                }`}
              >
                Inquiries ({contacts.length})
              </button>
              <button 
                onClick={() => setActiveSubTab("leads")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                  activeSubTab === "leads" ? "bg-white/[0.05] text-[#FF6B00]" : "text-[#A0A0A0]"
                }`}
              >
                Newsletter ({leads.length})
              </button>
            </div>

            {activeSubTab === "contacts" ? (
              <div className="bg-[#111111] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[#A0A0A0] font-mono">
                        <th className="p-4 uppercase tracking-wider font-semibold">User Details</th>
                        <th className="p-4 uppercase tracking-wider font-semibold">Service Request</th>
                        <th className="p-4 uppercase tracking-wider font-semibold">Message</th>
                        <th className="p-4 uppercase tracking-wider font-semibold">Submitted Date</th>
                        <th className="p-4 uppercase tracking-wider font-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {filteredContacts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-[#A0A0A0] italic">No contact inquiries found.</td>
                        </tr>
                      ) : (
                        filteredContacts.map((c) => (
                          <tr key={c.id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="p-4 space-y-1.5 align-top">
                              <div className="font-semibold text-[#F5F5F5] flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-[#FF6B00]" /> {c.name}
                              </div>
                              <div className="text-[#A0A0A0] flex items-center gap-1.5 font-mono text-[11px]"><Mail className="w-3 h-3" /> {c.email}</div>
                              {c.phone && <div className="text-[#A0A0A0] flex items-center gap-1.5 font-mono text-[11px]"><Phone className="w-3 h-3" /> {c.phone}</div>}
                              {c.company && <div className="text-[#A0A0A0] flex items-center gap-1.5 font-mono text-[11px]"><Briefcase className="w-3 h-3" /> {c.company}</div>}
                            </td>
                            <td className="p-4 align-top">
                              <span className="inline-block bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00] rounded-md px-2 py-0.5 text-[10px] font-bold font-mono">
                                {c.service}
                              </span>
                            </td>
                            <td className="p-4 align-top max-w-md">
                              <div className="text-[#A0A0A0] whitespace-pre-wrap leading-relaxed text-xs">{c.message}</div>
                            </td>
                            <td className="p-4 align-top font-mono text-[11px] text-[#A0A0A0]">
                              {c.createdAt.toLocaleDateString()}
                            </td>
                            <td className="p-4 align-top text-center">
                              <button 
                                onClick={() => handleDelete("contacts", c.id)}
                                className="text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-[#111111] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[#A0A0A0] font-mono">
                        <th className="p-4 uppercase tracking-wider font-semibold">Subscriber Email</th>
                        <th className="p-4 uppercase tracking-wider font-semibold">Referral Source</th>
                        <th className="p-4 uppercase tracking-wider font-semibold">Date Subscribed</th>
                        <th className="p-4 uppercase tracking-wider font-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-[#A0A0A0] italic">No newsletter subscribers found.</td>
                        </tr>
                      ) : (
                        filteredLeads.map((l) => (
                          <tr key={l.id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="p-4 font-mono text-[#F5F5F5]">{l.email}</td>
                            <td className="p-4 font-mono text-[#A0A0A0]">{l.source || "General Signup"}</td>
                            <td className="p-4 font-mono text-[11px] text-[#A0A0A0]">{l.createdAt.toLocaleDateString()}</td>
                            <td className="p-4 text-center">
                              <button 
                                onClick={() => handleDelete("leads", l.id)}
                                className="text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === "blogs" ? (
          /* BLOG MANAGER PANELS */
          <div className="bg-[#111111] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[#A0A0A0] font-mono">
                    <th className="p-4 uppercase tracking-wider font-semibold">Cover / Slug</th>
                    <th className="p-4 uppercase tracking-wider font-semibold">Title</th>
                    <th className="p-4 uppercase tracking-wider font-semibold">Excerpt</th>
                    <th className="p-4 uppercase tracking-wider font-semibold font-mono text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredBlogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-[#A0A0A0] italic">No custom database blogs found. Click "Add Item" to write one.</td>
                    </tr>
                  ) : (
                    filteredBlogs.map((b) => (
                      <tr key={b.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-4 space-y-1.5 align-top">
                          {b.coverImage ? (
                            <img src={b.coverImage} className="w-16 h-10 object-cover rounded-md border border-white/10" alt="" />
                          ) : (
                            <div className="w-16 h-10 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-text-muted font-mono">No Cover</div>
                          )}
                          <div className="text-[10px] font-mono text-text-muted select-all">/{b.slug}</div>
                        </td>
                        <td className="p-4 align-top">
                          <span className="text-[10px] uppercase text-[#FF6B00] font-bold font-mono tracking-widest">{b.category}</span>
                          <h4 className="font-bold text-text-main mt-0.5">{b.title}</h4>
                          <span className="text-[10px] font-mono text-text-muted block mt-1">Author: {b.author}</span>
                        </td>
                        <td className="p-4 align-top max-w-sm text-text-muted leading-relaxed text-xs">
                          {b.excerpt}
                        </td>
                        <td className="p-4 align-top text-center space-x-2">
                          <button 
                            onClick={() => startEdit("blog", b)}
                            className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-500/10 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete("blogs", b.id)}
                            className="text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === "portfolio" ? (
          /* PORTFOLIO MANAGER PANELS */
          <div className="bg-[#111111] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[#A0A0A0] font-mono">
                    <th className="p-4 uppercase tracking-wider font-semibold">Client / Industry</th>
                    <th className="p-4 uppercase tracking-wider font-semibold">Project Title</th>
                    <th className="p-4 uppercase tracking-wider font-semibold">Deliverables / Tech</th>
                    <th className="p-4 uppercase tracking-wider font-semibold font-mono text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-[#A0A0A0] italic">No custom database case studies found. Click "Add Item" to create one.</td>
                    </tr>
                  ) : (
                    filteredProjects.map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-4 align-top">
                          <div className="font-bold text-[#F5F5F5]">{p.client}</div>
                          <span className="text-[10px] uppercase text-[#FF6B00] font-bold font-mono tracking-widest">{p.category}</span>
                        </td>
                        <td className="p-4 align-top max-w-sm">
                          <h4 className="font-semibold text-text-main">{p.title}</h4>
                          <div className="text-[10px] text-text-muted mt-1 leading-normal font-mono">
                            <strong>Metric:</strong> {p.metric}
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          <p className="font-mono text-xs text-text-muted">{p.techStack}</p>
                          <p className="text-[10px] text-emerald-400 mt-1 uppercase tracking-wider font-semibold">{p.outcome}</p>
                        </td>
                        <td className="p-4 align-top text-center space-x-2">
                          <button 
                            onClick={() => startEdit("project", p)}
                            className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-500/10 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete("projects", p.id)}
                            className="text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === "testimonials" ? (
          /* TESTIMONIALS MANAGER PANELS */
          <div className="bg-[#111111] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[#A0A0A0] font-mono">
                    <th className="p-4 uppercase tracking-wider font-semibold">Author / Role</th>
                    <th className="p-4 uppercase tracking-wider font-semibold">Quote Review</th>
                    <th className="p-4 uppercase tracking-wider font-semibold font-mono text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredTestimonials.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-[#A0A0A0] italic">No custom database reviews found. Click "Add Item" to create one.</td>
                    </tr>
                  ) : (
                    filteredTestimonials.map((t) => (
                      <tr key={t.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-4 align-top">
                          <div className="font-bold text-[#F5F5F5]">{t.author}</div>
                          <div className="text-xs text-text-muted">{t.role} at <span className="text-[#FF6B00] font-semibold">{t.company}</span></div>
                        </td>
                        <td className="p-4 align-top max-w-lg italic text-text-muted text-xs leading-relaxed">
                          "{t.quote}"
                        </td>
                        <td className="p-4 align-top text-center space-x-2">
                          <button 
                            onClick={() => startEdit("testimonial", t)}
                            className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-500/10 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete("testimonials", t.id)}
                            className="text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* SERVICES MANAGER PANELS */
          <div className="bg-[#111111] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[#A0A0A0] font-mono">
                    <th className="p-4 uppercase tracking-wider font-semibold">Icon / Service Name</th>
                    <th className="p-4 uppercase tracking-wider font-semibold">Headline</th>
                    <th className="p-4 uppercase tracking-wider font-semibold">Pillars</th>
                    <th className="p-4 uppercase tracking-wider font-semibold font-mono text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredServices.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-[#A0A0A0] italic">No services found. Click "Add Item" or "Seed Default Content" to populate.</td>
                    </tr>
                  ) : (
                    filteredServices.map((s) => (
                      <tr key={s.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="p-4 align-top">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#FF6B00]">
                              {s.iconName === "Zap" ? <Zap className="w-4 h-4" /> :
                               s.iconName === "Cpu" ? <Cpu className="w-4 h-4" /> :
                               s.iconName === "Terminal" ? <Terminal className="w-4 h-4" /> :
                               s.iconName === "Sparkles" ? <Sparkles className="w-4 h-4" /> :
                               s.iconName === "BarChart2" ? <BarChart2 className="w-4 h-4" /> :
                               <Code className="w-4 h-4" />}
                            </div>
                            <span className="font-bold text-[#F5F5F5]">{s.name}</span>
                          </div>
                        </td>
                        <td className="p-4 align-top text-xs text-text-muted leading-relaxed max-w-xs">
                          {s.headline}
                        </td>
                        <td className="p-4 align-top text-xs font-mono text-text-muted max-w-xs">
                          {s.pillars}
                        </td>
                        <td className="p-4 align-top text-center space-x-2">
                          <button 
                            onClick={() => startEdit("service", s)}
                            className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-500/10 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete("services", s.id)}
                            className="text-rose-400 hover:text-rose-300 p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EDITOR FORM MODAL PANEL */}
        {editorType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#111111] border border-white/[0.1] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
              
              <div className="flex justify-between items-center p-6 border-b border-white/[0.08]">
                <h3 className="text-lg font-bold font-heading text-text-main">
                  {editId ? "Modify Existing Item" : "Create New Item"} &mdash; {editorType.toUpperCase()}
                </h3>
                <button onClick={closeEditor} className="text-[#A0A0A0] hover:text-[#F5F5F5]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1. BLOG FORM */}
              {editorType === "blog" && (
                <form onSubmit={saveBlog} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">Article Title</label>
                      <input 
                        type="text" required value={blogForm.title}
                        onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 text-text-main"
                        placeholder="e.g. Scaling Next.js Apps"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">URL Slug</label>
                      <input 
                        type="text" required value={blogForm.slug}
                        onChange={(e) => setBlogForm({...blogForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "-")})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 font-mono text-text-main"
                        placeholder="e.g. scaling-nextjs-apps"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">Category</label>
                      <input 
                        type="text" required value={blogForm.category}
                        onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 text-text-main"
                        placeholder="e.g. SaaS Development"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">Author</label>
                      <input 
                        type="text" required value={blogForm.author}
                        onChange={(e) => setBlogForm({...blogForm, author: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 text-text-main"
                        placeholder="e.g. Md Arsalan"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-1 font-mono">Cover Image</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-black/40 border border-white/10 rounded-xl p-4">
                      {blogForm.coverImage ? (
                        <div className="relative w-24 h-16 bg-white/5 border border-white/10 rounded-lg overflow-hidden shrink-0">
                          <img src={blogForm.coverImage} className="w-full h-full object-cover" alt="Cover preview" />
                          <button 
                            type="button" 
                            onClick={() => setBlogForm({ ...blogForm, coverImage: "" })}
                            className="absolute top-1 right-1 bg-black/80 hover:bg-black text-rose-400 p-1 rounded-full transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-16 rounded-lg bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-[10px] text-text-muted font-mono shrink-0">
                          No Image
                        </div>
                      )}
                      
                      <div className="flex-grow">
                        <input 
                          type="file" 
                          accept="image/*" 
                          id="blog-image-upload"
                          className="hidden" 
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                        />
                        <label 
                          htmlFor="blog-image-upload" 
                          className={`inline-flex items-center justify-center bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-semibold text-xs px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                          {uploadingImage ? "Uploading..." : "Choose Image File"}
                        </label>
                        <p className="text-[10px] text-text-muted mt-2 font-mono">Supports PNG, JPG, WebP. Direct upload to Firebase Storage.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">Excerpt / Short Summary</label>
                    <textarea 
                      required rows={2} value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 resize-none text-text-main"
                      placeholder="Summarize the article in 1-2 sentences..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">Article Content (Markdown Supported)</label>
                    <textarea 
                      required rows={8} value={blogForm.content}
                      onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 font-mono text-text-main"
                      placeholder="Use standard Markdown syntax. E.g. ## Header, **bold**, etc."
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
                    <button 
                      type="button" onClick={closeEditor}
                      className="border border-white/10 bg-white/[0.02] hover:bg-white/[0.07] px-5 py-2.5 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" disabled={submitting}
                      className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-[#FF6B00]/10"
                    >
                      {submitting ? "Saving..." : "Save Blog"}
                    </button>
                  </div>
                </form>
              )}

              {/* 2. PORTFOLIO CASE STUDY FORM */}
              {editorType === "project" && (
                <form onSubmit={saveProject} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">Client Name</label>
                      <input 
                        type="text" required value={projectForm.client}
                        onChange={(e) => setProjectForm({...projectForm, client: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 text-text-main"
                        placeholder="e.g. StudyCubs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">Industry / Category</label>
                      <input 
                        type="text" required value={projectForm.category}
                        onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 text-text-main"
                        placeholder="e.g. EdTech • Skill Development"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">Project Core Headline</label>
                    <input 
                      type="text" required value={projectForm.title}
                      onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 text-text-main"
                      placeholder="e.g. Online Learning Platform for Communication Skills"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">Challenge (The Problem - 1-2 sentences)</label>
                    <textarea 
                      required rows={2} value={projectForm.challenge}
                      onChange={(e) => setProjectForm({...projectForm, challenge: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 resize-none text-text-main"
                      placeholder="What was the business problem or user friction?"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">Our Solution (1-2 sentences)</label>
                    <textarea 
                      required rows={2} value={projectForm.solution}
                      onChange={(e) => setProjectForm({...projectForm, solution: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 resize-none text-text-main"
                      placeholder="How did we build the solution?"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">Tech Stack (Comma Separated)</label>
                      <input 
                        type="text" required value={projectForm.techStack}
                        onChange={(e) => setProjectForm({...projectForm, techStack: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 font-mono text-text-main"
                        placeholder="e.g. Next.js, Firebase, Tailwind"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">Outcome Metric Summary</label>
                      <input 
                        type="text" required value={projectForm.outcome}
                        onChange={(e) => setProjectForm({...projectForm, outcome: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 text-text-main"
                        placeholder="e.g. Scalable • Lead Gen Enabled"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">Primary Highlight Metric</label>
                      <input 
                        type="text" required value={projectForm.metric}
                        onChange={(e) => setProjectForm({...projectForm, metric: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 text-text-main"
                        placeholder="e.g. +45% Onboarding"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">Gradient CSS Overlay (Optional)</label>
                      <input 
                        type="text" value={projectForm.gradient}
                        onChange={(e) => setProjectForm({...projectForm, gradient: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 font-mono text-text-main"
                        placeholder="e.g. from-amber-600/20 to-orange-950/45"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
                    <button 
                      type="button" onClick={closeEditor}
                      className="border border-white/10 bg-white/[0.02] hover:bg-white/[0.07] px-5 py-2.5 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" disabled={submitting}
                      className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-[#FF6B00]/10"
                    >
                      {submitting ? "Saving..." : "Save Project"}
                    </button>
                  </div>
                </form>
              )}

              {/* 3. TESTIMONIAL FORM */}
              {editorType === "testimonial" && (
                <form onSubmit={saveTestimonial} className="p-6 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">Author Name</label>
                      <input 
                        type="text" required value={testimonialForm.author}
                        onChange={(e) => setTestimonialForm({...testimonialForm, author: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 text-text-main"
                        placeholder="e.g. Sarah Jenkins"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">Avatar Gradient</label>
                      <input 
                        type="text" value={testimonialForm.avatarGradient}
                        onChange={(e) => setTestimonialForm({...testimonialForm, avatarGradient: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 font-mono text-text-main"
                        placeholder="e.g. from-blue-500 to-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">Client Role / Title</label>
                      <input 
                        type="text" required value={testimonialForm.role}
                        onChange={(e) => setTestimonialForm({...testimonialForm, role: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 text-text-main"
                        placeholder="e.g. VP of Product"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">Company Name</label>
                      <input 
                        type="text" required value={testimonialForm.company}
                        onChange={(e) => setTestimonialForm({...testimonialForm, company: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 text-text-main"
                        placeholder="e.g. ScaleFlow Systems"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-1 font-mono">Testimonial Quote Review</label>
                    <textarea 
                      required rows={4} value={testimonialForm.quote}
                      onChange={(e) => setTestimonialForm({...testimonialForm, quote: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 text-text-main"
                      placeholder="Write the quote review content here..."
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
                    <button 
                      type="button" onClick={closeEditor}
                      className="border border-white/10 bg-white/[0.02] hover:bg-white/[0.07] px-5 py-2.5 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" disabled={submitting}
                      className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-[#FF6B00]/10"
                    >
                      {submitting ? "Saving..." : "Save Testimonial"}
                    </button>
                  </div>
                </form>
              )}

              {/* 4. SERVICES FORM */}
              {editorType === "service" && (
                <form onSubmit={saveService} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-1 font-mono">Service Name</label>
                      <input 
                        type="text" required value={serviceForm.name}
                        onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 text-text-main"
                        placeholder="e.g. Enterprise SaaS Development"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-1 font-mono">Service Icon</label>
                      <select 
                        required value={serviceForm.iconName}
                        onChange={(e) => setServiceForm({...serviceForm, iconName: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 text-text-main font-mono"
                      >
                        <option value="Code" className="bg-[#111111]">Code (Terminal bracket)</option>
                        <option value="Zap" className="bg-[#111111]">Zap (Lightning)</option>
                        <option value="Cpu" className="bg-[#111111]">Cpu (AI/Processor)</option>
                        <option value="Terminal" className="bg-[#111111]">Terminal (Command prompt)</option>
                        <option value="Sparkles" className="bg-[#111111]">Sparkles (Branding/Clean)</option>
                        <option value="BarChart2" className="bg-[#111111]">BarChart2 (Growth/CRO)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-1 font-mono">Headline (Brief Catchy Hook)</label>
                    <input 
                      type="text" required value={serviceForm.headline}
                      onChange={(e) => setServiceForm({...serviceForm, headline: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 text-text-main"
                      placeholder="e.g. Scalable, secure, and production-ready applications built to perform."
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-1 font-mono">Pillars / Sub-Features (Comma Separated)</label>
                    <input 
                      type="text" required value={serviceForm.pillars}
                      onChange={(e) => setServiceForm({...serviceForm, pillars: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 font-mono text-text-main"
                      placeholder="e.g. Full-Stack Next.js, Advanced APIs, Secure DB Setup"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] mb-1 font-mono">Description Detail</label>
                    <textarea 
                      required rows={4} value={serviceForm.description}
                      onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF6B00]/40 text-text-main"
                      placeholder="Describe what we deliver, our methodology and technology context..."
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
                    <button 
                      type="button" onClick={closeEditor}
                      className="border border-white/10 bg-white/[0.02] hover:bg-white/[0.07] px-5 py-2.5 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" disabled={submitting}
                      className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-[#FF6B00]/10"
                    >
                      {submitting ? "Saving..." : "Save Service"}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </main>
  );
}
