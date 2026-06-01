import { Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { whatsappLink } from "../lib/whatsapp";
import { Brand } from "./Brand";

export function PublicHeader() {
  const { content } = useApp();
  const [open, setOpen] = useState(false);
  const links = [["Services", "#services"], ["How It Works", "#process"], ["Vehicles", "#gallery"], ["Reviews", "#reviews"]];
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="container-page flex h-18 items-center justify-between py-3">
        <Link to="/"><Brand /></Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {links.map(([label, href]) => <a key={href} href={href} className="text-sm font-bold text-slate-600 hover:text-ink">{label}</a>)}
          <Link to="/estimate" className="btn-primary">Get Free Estimate</Link>
          <a href={whatsappLink(content.whatsapp_number)} target="_blank" rel="noreferrer" className="btn-whatsapp"><MessageCircle size={18} /> WhatsApp Now</a>
        </nav>
        <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <div className="container-page grid gap-2 border-t border-slate-100 py-4 lg:hidden">
        {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className="py-2 text-sm font-bold text-slate-700">{label}</a>)}
        <Link to="/estimate" className="btn-primary mt-2">Get Free Estimate</Link>
      </div>}
    </header>
  );
}
