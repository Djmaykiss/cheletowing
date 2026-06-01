import { Save } from "lucide-react";
import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { PageTitle } from "./AdminDashboard";

export default function ContentPage() {
  const { content, saveContent } = useApp();
  const [draft, setDraft] = useState(content);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const update = (key, value) => { setSaved(false); setDraft((current) => ({ ...current, [key]: value })); };
  const updateJson = (key, value) => { try { update(key, JSON.parse(value)); } catch { setDraft((current) => ({ ...current, [`${key}_raw`]: value })); } };
  async function submit(event) { event.preventDefault(); setError(""); const clean = { ...draft }; delete clean.services_raw; delete clean.gallery; delete clean.testimonials; try { await saveContent(clean); setSaved(true); } catch (saveError) { setError(saveError.message); } }
  return <><PageTitle eyebrow="Website" title="Content manager" text="Update the public landing page content and business WhatsApp configuration." /><form className="mt-6 grid gap-5" onSubmit={submit}><section className="card grid gap-4 p-5"><h2 className="font-black">Hero section</h2><Field label="Main headline"><input className="field" value={draft.hero_title} onChange={(e) => update("hero_title", e.target.value)} /></Field><Field label="English description"><textarea className="field" rows="3" value={draft.hero_subtitle} onChange={(e) => update("hero_subtitle", e.target.value)} /></Field><Field label="Spanish description"><textarea className="field" rows="3" value={draft.hero_spanish} onChange={(e) => update("hero_spanish", e.target.value)} /></Field><Field label="Hero image URL"><input className="field" value={draft.hero_image} onChange={(e) => update("hero_image", e.target.value)} /></Field><Field label="Owner WhatsApp number"><input className="field" placeholder="Country code + number" value={draft.whatsapp_number} onChange={(e) => update("whatsapp_number", e.target.value)} /></Field></section><section className="card grid gap-4 p-5"><h2 className="font-black">Business services</h2><p className="text-xs leading-relaxed text-slate-500">Gallery images and testimonials are loaded from their dedicated Supabase tables. This JSON collection controls the public service cards.</p><JsonField label="Services" value={draft.services_raw ?? JSON.stringify(draft.services, null, 2)} onChange={(value) => updateJson("services", value)} /></section><div className="flex items-center gap-3"><button className="btn-primary"><Save size={17} /> Save content</button>{saved && <p className="text-sm font-bold text-green-600">Content saved.</p>}{error && <p className="text-sm font-bold text-red-600">{error}</p>}</div></form></>;
}
function Field({ label, children }) { return <label><span className="label">{label}</span>{children}</label>; }
function JsonField({ label, value, onChange }) { return <Field label={label}><textarea className="field font-mono text-xs" rows="7" value={value} onChange={(e) => onChange(e.target.value)} /></Field>; }
