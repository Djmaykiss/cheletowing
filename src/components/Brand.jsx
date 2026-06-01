import { Truck } from "lucide-react";

export function Brand({ light = false }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-towing text-ink"><Truck size={22} strokeWidth={2.8} /></span>
      <div>
        <p className={`text-base font-black uppercase leading-none tracking-wide ${light ? "text-white" : "text-ink"}`}>Chele Towing</p>
        <p className={`mt-1 text-[10px] font-bold uppercase tracking-[0.22em] ${light ? "text-slate-300" : "text-slate-500"}`}>Cash for Cars · Florida</p>
      </div>
    </div>
  );
}
