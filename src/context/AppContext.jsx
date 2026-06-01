import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultContent, gallery, services, testimonials } from "../data/defaultContent";
import { demoLeads } from "../data/demoLeads";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const AppContext = createContext(null);
const contentKey = "chele-towing-content";
const leadKey = "chele-towing-demo-leads";

function getStored(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}
function getSessionStored(key, fallback) {
  try { return JSON.parse(sessionStorage.getItem(key)) || fallback; } catch { return fallback; }
}
function getInitialContent() {
  const stored = getStored(contentKey, {});
  return { ...defaultContent, ...stored, whatsapp_number: stored.whatsapp_number || defaultContent.whatsapp_number };
}

export function AppProvider({ children }) {
  const [content, setContent] = useState(getInitialContent);
  const [leads, setLeads] = useState(() => getStored(leadKey, demoLeads));
  const [session, setSession] = useState(() => isSupabaseConfigured ? null : getSessionStored("chele-towing-demo-session", null));
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase) return;
    Promise.all([
      supabase.from("vehicle_leads").select("*").order("created_at", { ascending: false }),
      supabase.from("site_content").select("content").eq("id", 1).maybeSingle(),
    ]).then(([leadResult, contentResult]) => {
      if (leadResult.data) setLeads(leadResult.data);
      if (contentResult.data?.content) setContent({ ...defaultContent, ...contentResult.data.content });
      setLoading(false);
    });
  }, []);

  async function addLead(lead, files = []) {
    let photoPaths = [];
    if (supabase && files.length) {
      photoPaths = await Promise.all(files.map(async (file) => {
        const path = `${crypto.randomUUID()}/${file.name}`;
        const { error } = await supabase.storage.from("vehicle-photos").upload(path, file);
        if (error) throw error;
        return supabase.storage.from("vehicle-photos").getPublicUrl(path).data.publicUrl;
      }));
    }
    const next = { ...lead, photos: photoPaths, id: crypto.randomUUID(), created_at: new Date().toISOString(), status: "new" };
    if (supabase) {
      const { data, error } = await supabase.from("vehicle_leads").insert({ ...lead, photos: photoPaths }).select().single();
      if (error) throw error;
      setLeads((current) => [data, ...current]);
      return data;
    }
    setLeads((current) => {
      const updated = [next, ...current];
      localStorage.setItem(leadKey, JSON.stringify(updated));
      return updated;
    });
    return next;
  }

  async function updateLeadStatus(id, status) {
    if (supabase) await supabase.from("vehicle_leads").update({ status }).eq("id", id);
    setLeads((current) => {
      const updated = current.map((lead) => lead.id === id ? { ...lead, status } : lead);
      if (!supabase) localStorage.setItem(leadKey, JSON.stringify(updated));
      return updated;
    });
  }

  async function saveContent(next) {
    setContent(next);
    localStorage.setItem(contentKey, JSON.stringify(next));
    if (supabase) await supabase.from("site_content").upsert({ id: 1, content: next });
  }

  async function signIn(email, password) {
    if (!supabase) {
      const demoSession = { user: { email: email || "demo@local" }, demo: true };
      sessionStorage.setItem("chele-towing-demo-session", JSON.stringify(demoSession));
      setSession(demoSession);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }
  async function signOut() { if (supabase) await supabase.auth.signOut(); sessionStorage.removeItem("chele-towing-demo-session"); setSession(null); }

  const value = useMemo(() => ({ content, leads, session, loading, isDemo: !isSupabaseConfigured, addLead, updateLeadStatus, saveContent, signIn, signOut, services, gallery, testimonials }), [content, leads, session, loading]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
