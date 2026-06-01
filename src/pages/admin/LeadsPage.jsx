import { Eye, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { StatusBadge, statuses } from "../../components/StatusBadge";
import { useApp } from "../../context/AppContext";
import { money } from "../../lib/estimate";
import { PageTitle } from "./AdminDashboard";

export default function LeadsPage() {
  const { leads } = useApp();
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => leads.filter((lead) => (status === "all" || lead.status === status) && `${lead.owner_name} ${lead.make} ${lead.model} ${lead.city}`.toLowerCase().includes(query.toLowerCase())), [leads, status, query]);
  return <><PageTitle eyebrow="Pipeline" title="Vehicle leads" text="Review estimate requests, filter the pipeline, and open each vehicle record." /><div className="card mt-6 overflow-hidden"><div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-3 text-slate-400" size={17} /><input className="field pl-9" placeholder="Search owner, vehicle, or city" value={query} onChange={(e) => setQuery(e.target.value)} /></label><select className="field sm:w-48" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select></div><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400"><tr><th className="px-4 py-3">Owner</th><th className="px-4 py-3">Vehicle</th><th className="px-4 py-3">City</th><th className="px-4 py-3">Estimate</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th></tr></thead><tbody>{visible.map((lead) => <tr key={lead.id} className="border-t border-slate-100 hover:bg-slate-50"><td className="px-4 py-4 font-bold">{lead.owner_name}<p className="mt-1 text-xs font-normal text-slate-400">{lead.phone}</p></td><td className="px-4 py-4">{lead.vehicle_year} {lead.make} {lead.model}</td><td className="px-4 py-4">{lead.city}</td><td className="px-4 py-4 font-bold">{money(lead.estimated_price_min)} - {money(lead.estimated_price_max)}</td><td className="px-4 py-4"><StatusBadge status={lead.status} /></td><td className="px-4 py-4"><Link to={`/admin/leads/${lead.id}`} className="inline-flex rounded-lg p-2 text-slate-500 hover:bg-yellow-100 hover:text-yellow-700" aria-label="View lead"><Eye size={18} /></Link></td></tr>)}</tbody></table></div>{!visible.length && <p className="p-8 text-center text-sm text-slate-500">No leads match the current filter.</p>}</div></>;
}
