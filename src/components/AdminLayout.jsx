import { BarChart3, CarFront, FileText, LogOut, Menu, Settings, X } from "lucide-react";
import { createElement, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Brand } from "./Brand";

const nav = [["Dashboard", "/admin", BarChart3], ["Leads", "/admin/leads", CarFront], ["Content Manager", "/admin/content", FileText], ["Settings", "/admin/settings", Settings]];

export function AdminLayout() {
  const { signOut, session, dataError } = useApp();
  const [open, setOpen] = useState(false);
  return <div className="min-h-screen bg-slate-100">
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-ink p-4 text-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex items-center justify-between"><Brand light /><button className="lg:hidden" onClick={() => setOpen(false)}><X /></button></div>
      <nav className="mt-10 grid gap-1">{nav.map(([label, to, Icon]) => <NavLink key={to} to={to} end={to === "/admin"} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold ${isActive ? "bg-towing text-ink" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>{createElement(Icon, { size: 18 })}{label}</NavLink>)}</nav>
      <div className="absolute inset-x-4 bottom-4">
        <a href="/" className="mb-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white"><Settings size={18} /> View website</a>
        <button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white"><LogOut size={18} /> Sign out</button>
      </div>
    </aside>
    <div className="lg:pl-64">
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-7"><button className="lg:hidden" onClick={() => setOpen(true)}><Menu /></button><div className="ml-auto flex items-center gap-3"><div className="text-right"><p className="text-xs font-black">{session?.user?.email}</p><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Administrator</p></div><span className="grid h-9 w-9 place-items-center rounded-full bg-yellow-100 text-xs font-black text-yellow-700">CT</span></div></header>
      <main className="p-4 sm:p-7">{dataError && <p className="mb-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{dataError}</p>}<Outlet /></main>
    </div>
  </div>;
}
