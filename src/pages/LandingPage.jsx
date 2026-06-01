import { ArrowRight, Banknote, CarFront, CheckCircle2, ClipboardCheck, Clock3, MapPin, MessageCircle, Phone, ShieldCheck, Star, Truck, Wrench } from "lucide-react";
import { createElement } from "react";
import { Link } from "react-router-dom";
import { PublicHeader } from "../components/PublicHeader";
import { useApp } from "../context/AppContext";
import { whatsappLink } from "../lib/whatsapp";

export default function LandingPage() {
  const { content, services, dataError } = useApp();
  const visibleServices = content.services || services;
  const visibleGallery = content.gallery || [];
  const visibleTestimonials = content.testimonials || [];
  return <div className="bg-white">
    <PublicHeader />
    {dataError && <p className="bg-red-50 px-4 py-2 text-center text-xs font-semibold text-red-700">Some live website content is temporarily unavailable. Please contact Chele Towing by phone or WhatsApp.</p>}
    <section className="relative overflow-hidden bg-ink text-white">
      {content.hero_image && <div className="absolute inset-0 opacity-30"><img src={content.hero_image} className="h-full w-full object-cover" alt="Vehicle towing service" /></div>}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/30" />
      <div className="container-page relative grid min-h-[650px] items-center gap-10 py-20 lg:grid-cols-[1fr_390px]">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-400/50 bg-yellow-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-yellow-300"><Truck size={15} /> Serving Florida</p>
          <h1 className="text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">{content.hero_title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-200">{content.hero_subtitle}</p>
          <p className="mt-3 max-w-2xl text-base font-semibold text-yellow-300">{content.hero_spanish}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/estimate" className="btn-primary px-6 py-4 text-base">Get Free Estimate <ArrowRight size={19} /></Link>
            <a href={whatsappLink(content.whatsapp_number)} target="_blank" rel="noreferrer" className="btn-whatsapp px-6 py-4 text-base"><MessageCircle size={19} /> WhatsApp Now</a>
          </div>
        </div>
        <div className="card hidden bg-white/95 p-6 text-ink backdrop-blur lg:block">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-600">Simple and fast</p>
          <h2 className="mt-2 text-2xl font-black">Sell your vehicle without the hassle.</h2>
          <div className="mt-6 grid gap-4">
            {["Any vehicle condition", "Clear estimate range", "Coordinated pickup", "Bilingual service"].map((item) => <p key={item} className="flex items-center gap-3 text-sm font-bold"><CheckCircle2 className="text-green-500" size={19} /> {item}</p>)}
          </div>
        </div>
      </div>
    </section>

    <section className="border-b border-slate-100 bg-slate-50 py-6">
      <div className="container-page grid gap-5 text-sm font-bold text-slate-700 sm:grid-cols-3">
        <p className="flex items-center gap-3"><ShieldCheck className="text-yellow-500" /> Fair vehicle evaluation</p>
        <p className="flex items-center gap-3"><Banknote className="text-yellow-500" /> Cash offer estimate</p>
        <p className="flex items-center gap-3"><Truck className="text-yellow-500" /> Pickup coordination</p>
      </div>
    </section>

    <section id="services" className="container-page py-20">
      <SectionTitle eyebrow="What we buy / Qué compramos" title="Every car still has value." text="Tell us what you have. We evaluate cars, trucks, SUVs, damaged vehicles, and junk cars." />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {visibleServices.map((service, i) => { const Icon = [CarFront, Wrench, Truck][i % 3]; return <article key={service.title} className="card p-6"><Icon className="text-yellow-500" size={30} /><h3 className="mt-5 text-xl font-black">{service.title}</h3><p className="mt-1 text-sm font-bold text-yellow-600">{service.subtitle}</p><p className="mt-3 text-sm leading-relaxed text-slate-600">{service.text}</p></article>; })}
      </div>
    </section>

    <section id="process" className="bg-ink py-20 text-white">
      <div className="container-page">
        <SectionTitle dark eyebrow="How it works / Cómo funciona" title="From driveway to done in three steps." text="A straightforward process built for speed and clear communication." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[["01", ClipboardCheck, "Send vehicle details", "Complete the form and add photos. / Completa el formulario y agrega fotos."], ["02", MessageCircle, "Review your estimate", "We receive your details on WhatsApp. / Recibimos tus datos por WhatsApp."], ["03", Banknote, "Coordinate pickup", "Confirm the final price after inspection. / Confirma el precio final tras inspección."]].map(([number, Icon, title, text]) => <article key={number} className="rounded-2xl border border-white/10 bg-white/5 p-6"><span className="text-sm font-black text-yellow-300">{number}</span>{createElement(Icon, { className: "mt-6 text-yellow-300" })}<h3 className="mt-4 text-xl font-black">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-300">{text}</p></article>)}
        </div>
      </div>
    </section>

    {visibleGallery.length > 0 && <section id="gallery" className="container-page py-20">
      <SectionTitle eyebrow="Vehicles / Vehículos" title="We evaluate all kinds of vehicles." text="Condition is not a dealbreaker. Send the details and photos for an estimate." />
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
        {visibleGallery.map((image, i) => <img key={image} src={image} alt={`Vehicle example ${i + 1}`} className="h-40 w-full rounded-2xl object-cover sm:h-56" />)}
      </div>
    </section>}

    {visibleTestimonials.length > 0 && <section id="reviews" className="bg-slate-50 py-20">
      <div className="container-page">
        <SectionTitle eyebrow="Reviews / Reseñas" title="A simpler way to sell your car." text="What vehicle owners say about their Chele Towing experience." />
        <div className="mt-10 grid gap-5 md:grid-cols-3">{visibleTestimonials.map((item) => <article key={item.name} className="card p-6"><div className="flex text-yellow-400">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={17} fill="currentColor" />)}</div><p className="mt-5 text-sm leading-relaxed text-slate-600">“{item.text}”</p><p className="mt-5 text-sm font-black">{item.name}</p></article>)}</div>
      </div>
    </section>}

    <section className="bg-towing py-16">
      <div className="container-page flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div><p className="text-sm font-black uppercase tracking-[0.2em]">Ready to sell? / ¿Listo para vender?</p><h2 className="mt-2 text-3xl font-black tracking-tight">Get your free vehicle estimate today.</h2></div>
        <Link to="/estimate" className="btn-dark px-6 py-4">Start Your Estimate <ArrowRight size={18} /></Link>
      </div>
    </section>
    <footer className="bg-ink text-slate-400">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.2fr_0.8fr] lg:grid-cols-[1.2fr_0.8fr_1fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-yellow-300">Chele Towing</p>
          <h2 className="mt-4 max-w-sm text-2xl font-black tracking-tight text-white">A professional vehicle buying experience built for Florida drivers.</h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-400">Fast estimates, clear communication, and a simple way to sell vehicles in any condition.</p>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-200">Vehicle Services</p>
          <ul className="mt-5 grid gap-3 text-sm">
            {["Vehicle Buying Services", "Junk Car Removal", "Cash For Cars", "Free Vehicle Pickup", "Fast Estimates", "Florida Coverage"].map((service) => <li key={service} className="flex items-center gap-2 text-slate-400"><span className="h-1 w-1 rounded-full bg-yellow-300" />{service}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-yellow-300/40 hover:bg-white/[0.07]">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-yellow-300/10 text-yellow-300"><Truck size={20} /></span><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-300">Contact Chele Towing</p><p className="mt-1 text-sm font-black text-white">Fast estimates and pickup coordination</p></div></div>
          <div className="mt-5 grid gap-3 text-sm">
            <a href="tel:13053907779" className="flex items-center gap-3 text-slate-300 hover:text-white"><Phone size={16} className="text-yellow-300" /> (305) 390-7779</a>
            <p className="flex items-center gap-3 text-slate-300"><Clock3 size={16} className="text-yellow-300" /> Service hours available by phone</p>
            <p className="flex items-center gap-3 text-slate-300"><MapPin size={16} className="text-yellow-300" /> Serving Florida</p>
          </div>
          <a href={whatsappLink(content.whatsapp_number)} target="_blank" rel="noreferrer" className="btn-whatsapp mt-5 w-full"><MessageCircle size={17} /> WhatsApp Now</a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col justify-between gap-3 py-5 text-xs sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Chele Towing. Florida.</p>
          <p className="text-[10px] leading-relaxed text-slate-500">Website designed &amp; developed by <a href="https://djmaykiss.github.io/Minuevocurriculum/" target="_blank" rel="noreferrer" className="font-bold text-slate-300 hover:text-yellow-300">Michael Alexander Perez</a> <span className="px-1 text-slate-600">|</span> <a href="https://www.markingwebs.com" target="_blank" rel="noreferrer" className="font-bold text-slate-300 hover:text-yellow-300">MarkingWebs</a></p>
        </div>
      </div>
    </footer>
  </div>;
}

function SectionTitle({ eyebrow, title, text, dark = false }) {
  return <div className="max-w-2xl"><p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-500">{eyebrow}</p><h2 className={`mt-3 text-3xl font-black tracking-tight sm:text-4xl ${dark ? "text-white" : "text-ink"}`}>{title}</h2><p className={`mt-4 leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{text}</p></div>;
}
