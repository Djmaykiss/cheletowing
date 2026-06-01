const styles = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-violet-100 text-violet-700",
  negotiating: "bg-orange-100 text-orange-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
  picked_up: "bg-cyan-100 text-cyan-700",
  paid: "bg-slate-800 text-white",
};

export const statuses = Object.keys(styles);

export function StatusBadge({ status }) {
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${styles[status] || styles.new}`}>{status?.replace("_", " ")}</span>;
}
