import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Brand } from "../../components/Brand";
import { useApp } from "../../context/AppContext";

export default function LoginPage() {
  const { session, signIn } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  if (session) return <Navigate to="/admin" replace />;
  async function submit(event) { event.preventDefault(); setError(""); try { await signIn(email, password); } catch (loginError) { setError(loginError.message); } }
  return <main className="grid min-h-screen place-items-center bg-ink px-4 py-10"><section className="card w-full max-w-md p-7 sm:p-9"><Brand /><div className="mt-8"><LockKeyhole className="text-yellow-500" /><h1 className="mt-4 text-3xl font-black">Admin login</h1><p className="mt-2 text-sm text-slate-500">Manage vehicle leads and website content.</p></div><form className="mt-6 grid gap-4" onSubmit={submit}><label><span className="label">Email</span><input required type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} /></label><label><span className="label">Password</span><input required type="password" className="field" value={password} onChange={(e) => setPassword(e.target.value)} /></label>{error && <p className="text-sm font-semibold text-red-600">{error}</p>}<button className="btn-primary mt-2">Sign in</button></form></section></main>;
}
