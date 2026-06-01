import { ArrowLeft, Calculator, Camera, CheckCircle2, MessageCircle, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Brand } from "../components/Brand";
import { useApp } from "../context/AppContext";
import { getVehicleModels, vehicleMakes, vehicleYears } from "../data/vehicleOptions";
import { calculateEstimate, money } from "../lib/estimate";
import { leadWhatsAppMessage, whatsappLink } from "../lib/whatsapp";

const initialForm = { owner_name: "", phone: "", address: "", city: "", vehicle_year: "", make: "", model: "", vehicle_condition: "fair", has_title: true, has_catalytic: true, has_key: true, runs: true, notes: "" };
const options = [["good", "Good / Bueno"], ["fair", "Fair / Regular"], ["damaged", "Damaged / Chocado"], ["not_running", "Not running / No prende"], ["junk", "Junk / Desarme"]];

export default function EstimatePage() {
  const { content, addLead, isDemo } = useApp();
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const estimate = useMemo(() => calculateEstimate(form), [form]);
  const vehicleModels = useMemo(() => getVehicleModels(form.make), [form.make]);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const updateYear = (value) => setForm((current) => ({ ...current, vehicle_year: value, make: "", model: "" }));
  const updateMake = (value) => setForm((current) => ({ ...current, make: value, model: "" }));

  async function submit(event) {
    event.preventDefault();
    setSaving(true); setError("");
    try {
      const lead = await addLead({ ...form, vehicle_year: Number(form.vehicle_year), estimated_price_min: estimate.min, estimated_price_max: estimate.max }, files);
      setSubmitted(lead);
      const url = whatsappLink(content.whatsapp_number, leadWhatsAppMessage(lead));
      if (url !== "#") window.open(url, "_blank", "noopener,noreferrer");
    } catch (submitError) {
      setError(submitError.message || "Unable to save your estimate. Please try again.");
    } finally { setSaving(false); }
  }

  if (submitted) return <main className="grid min-h-screen place-items-center bg-slate-100 px-4 py-10"><div className="card max-w-xl p-8 text-center sm:p-10"><CheckCircle2 className="mx-auto text-green-500" size={58} /><h1 className="mt-5 text-3xl font-black">Estimate request received</h1><p className="mt-3 text-slate-600">Solicitud recibida. Your estimated offer range is:</p><p className="mt-5 text-3xl font-black text-yellow-600">{money(submitted.estimated_price_min)} - {money(submitted.estimated_price_max)}</p><p className="mt-3 text-sm text-slate-500">The final price may change after vehicle inspection.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><a className="btn-whatsapp" target="_blank" rel="noreferrer" href={whatsappLink(content.whatsapp_number, leadWhatsAppMessage(submitted))}><MessageCircle size={18} /> Open WhatsApp</a><Link className="btn-dark" to="/">Back to Home</Link></div></div></main>;

  return <div className="min-h-screen bg-slate-100">
    <header className="border-b border-slate-200 bg-white"><div className="container-page flex items-center justify-between py-4"><Link to="/"><Brand /></Link><Link to="/" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-ink"><ArrowLeft size={17} /> Back to website</Link></div></header>
    <main className="container-page grid gap-7 py-8 lg:grid-cols-[1fr_340px]">
      <section className="card p-5 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-600">Free estimate / Cotización gratis</p>
        <h1 className="mt-2 text-3xl font-black">Tell us about your vehicle.</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">Complete the details below. Completa los datos para recibir un rango aproximado.</p>
        {isDemo && <p className="mt-4 rounded-xl bg-blue-50 p-3 text-xs font-semibold text-blue-700">Demo mode: submissions are stored in this browser until Supabase is configured.</p>}
        <form className="mt-7 grid gap-5" onSubmit={submit}>
          <FormSection title="Owner information / Datos del dueño">
            <Field label="Owner name / Nombre del dueño"><input required className="field" value={form.owner_name} onChange={(e) => update("owner_name", e.target.value)} /></Field>
            <Field label="Phone / Teléfono"><input required type="tel" className="field" value={form.phone} onChange={(e) => update("phone", e.target.value)} /></Field>
            <Field label="Address / Dirección"><input required className="field" value={form.address} onChange={(e) => update("address", e.target.value)} /></Field>
            <Field label="City / Ciudad"><input required className="field" value={form.city} onChange={(e) => update("city", e.target.value)} /></Field>
          </FormSection>
          <FormSection title="Vehicle / Vehículo">
            <Field label="Year / Año"><select required className="field" value={form.vehicle_year} onChange={(e) => updateYear(e.target.value)}><option value="">Select year / Selecciona año</option>{vehicleYears.map((year) => <option key={year} value={year}>{year}</option>)}</select></Field>
            <Field label="Make / Marca"><select required disabled={!form.vehicle_year} className="field disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400" value={form.make} onChange={(e) => updateMake(e.target.value)}><option value="">Select make / Selecciona marca</option>{vehicleMakes.map((make) => <option key={make} value={make}>{make}</option>)}</select></Field>
            <Field label="Model / Modelo"><select required disabled={!form.make} className="field disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400" value={form.model} onChange={(e) => update("model", e.target.value)}><option value="">Select model / Selecciona modelo</option>{vehicleModels.map((model) => <option key={model} value={model}>{model}</option>)}</select></Field>
            <Field label="Condition / Estado"><select className="field" value={form.vehicle_condition} onChange={(e) => update("vehicle_condition", e.target.value)}>{options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
          </FormSection>
          <div className="grid gap-3 sm:grid-cols-2">{[["has_title", "Has title? / ¿Tiene título?"], ["has_catalytic", "Has catalytic? / ¿Tiene catalítico?"], ["has_key", "Has key? / ¿Tiene llave?"], ["runs", "Does it run? / ¿El vehículo prende?"]].map(([key, label]) => <Toggle key={key} label={label} checked={form[key]} onChange={(value) => update(key, value)} />)}</div>
          <Field label="Vehicle photos / Fotos del vehículo"><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-bold text-slate-600 hover:border-yellow-400 hover:bg-yellow-50"><Camera size={20} className="text-yellow-600" /> {files.length ? `${files.length} photo(s) selected` : "Add vehicle photos"}<input className="hidden" type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files || []))} /></label></Field>
          <Field label="Additional comments / Comentarios adicionales"><textarea rows="4" className="field" value={form.notes} onChange={(e) => update("notes", e.target.value)} /></Field>
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
          <button className="btn-primary py-4 text-base" disabled={saving}>{saving ? "Saving..." : "Send Estimate Request"} <MessageCircle size={19} /></button>
        </form>
      </section>
      <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl bg-ink p-6 text-white shadow-soft">
          <Calculator className="text-yellow-300" />
          <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-yellow-300">Estimated offer</p>
          <p className="mt-2 text-3xl font-black">{money(estimate.min)} - {money(estimate.max)}</p>
          <p className="mt-4 text-xs leading-relaxed text-slate-300">The final price may change after vehicle inspection.</p>
        </div>
        <div className="card p-5"><p className="flex items-center gap-2 text-sm font-black"><ShieldCheck size={18} className="text-green-500" /> What happens next?</p><p className="mt-3 text-sm leading-relaxed text-slate-600">Your details are saved and a WhatsApp message is prepared so Chele Towing can review the vehicle.</p></div>
      </aside>
    </main>
  </div>;
}

function FormSection({ title, children }) { return <div><h2 className="mb-3 border-b border-slate-100 pb-2 text-sm font-black text-ink">{title}</h2><div className="grid gap-4 sm:grid-cols-2">{children}</div></div>; }
function Field({ label, children }) { return <label><span className="label">{label}</span>{children}</label>; }
function Toggle({ label, checked, onChange }) { return <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-700"><span>{label}</span><input className="h-4 w-4 accent-yellow-500" type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /></label>; }
