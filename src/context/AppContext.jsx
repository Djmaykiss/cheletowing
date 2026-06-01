import { createContext, useContext, useEffect, useState } from "react";
import { defaultContent, services } from "../data/defaultContent";
import { createLead, getGalleryImages, getSiteContent, getTestimonials, getVehicleLeads, isSupabaseConfigured, supabase, updateVehicleLeadStatus, uploadVehiclePhotos, upsertSiteContent } from "../lib/supabase";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [content, setContent] = useState(defaultContent);
  const [leads, setLeads] = useState([]);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState(isSupabaseConfigured ? "" : "Supabase environment variables are not configured.");

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase) return;
    setLoading(true);
    Promise.all([
      getSiteContent(),
      getTestimonials(),
      getGalleryImages(),
    ]).then(([contentResult, testimonialResult, galleryResult]) => {
      const remoteContent = { ...defaultContent, ...contentResult?.content };
      remoteContent.testimonials = testimonialResult.map((item) => ({ name: item.customer_name, text: item.testimonial_text }));
      remoteContent.gallery = galleryResult.map((item) => item.image_url);
      setContent(remoteContent);
      setDataError("");
    }).catch((error) => {
      setDataError(error.message);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!session) { setLeads([]); return; }
    getVehicleLeads().then(setLeads).catch((error) => setDataError(error.message));
  }, [session]);

  async function addLead(lead, files = []) {
    const photos = files.length ? await uploadVehiclePhotos(files) : [];
    const createdLead = await createLead({ ...lead, photos });
    if (session) setLeads((current) => [createdLead, ...current]);
    return createdLead;
  }

  async function updateLeadStatus(id, status) {
    try {
      await updateVehicleLeadStatus(id, status);
      setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, status } : lead));
    } catch (error) {
      setDataError(error.message);
      throw error;
    }
  }

  async function saveContent(next) {
    try {
      await upsertSiteContent(next);
      setContent(next);
    } catch (error) {
      setDataError(error.message);
      throw error;
    }
  }

  async function signIn(email, password) {
    if (!supabase) throw new Error("Supabase environment variables are not configured.");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }
  async function signOut() { if (supabase) await supabase.auth.signOut(); setSession(null); }

  const value = { content, leads, session, loading, dataError, addLead, updateLeadStatus, saveContent, signIn, signOut, services, gallery: content.gallery, testimonials: content.testimonials };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
