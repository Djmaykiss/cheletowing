import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);
export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;

function requireSupabase() {
  if (!supabase) throw new Error("Supabase environment variables are not configured.");
  return supabase;
}

function unwrap(result, message) {
  if (result.error) throw new Error(`${message}: ${result.error.message}`);
  return result.data;
}

export async function getVehicleLeads() {
  const result = await requireSupabase().from("vehicle_leads").select("*").order("created_at", { ascending: false });
  return unwrap(result, "Unable to load vehicle leads");
}

export async function createLead(lead) {
  const result = await requireSupabase().from("vehicle_leads").insert(lead).select().single();
  return unwrap(result, "Unable to save vehicle lead");
}

export async function updateVehicleLeadStatus(id, status) {
  const result = await requireSupabase().from("vehicle_leads").update({ status }).eq("id", id);
  return unwrap(result, "Unable to update lead status");
}

export async function getSiteContent() {
  const result = await requireSupabase().from("site_content").select("content").eq("id", 1).maybeSingle();
  return unwrap(result, "Unable to load site content");
}

export async function upsertSiteContent(content) {
  const result = await requireSupabase().from("site_content").upsert({ id: 1, content });
  return unwrap(result, "Unable to save site content");
}

export async function getTestimonials() {
  const result = await requireSupabase().from("testimonials").select("customer_name, testimonial_text").eq("is_active", true).order("sort_order", { ascending: true });
  return unwrap(result, "Unable to load testimonials");
}

export async function getGalleryImages() {
  const result = await requireSupabase().from("gallery_images").select("image_url").eq("is_active", true).order("sort_order", { ascending: true });
  return unwrap(result, "Unable to load gallery images");
}

export async function uploadVehiclePhotos(files) {
  const client = requireSupabase();
  return Promise.all(files.map(async (file) => {
    const path = `${crypto.randomUUID()}/${file.name}`;
    const { error } = await client.storage.from("vehicle-photos").upload(path, file);
    if (error) throw new Error(`Unable to upload vehicle photo: ${error.message}`);
    return client.storage.from("vehicle-photos").getPublicUrl(path).data.publicUrl;
  }));
}
