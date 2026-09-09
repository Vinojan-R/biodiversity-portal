import { Leaf, MailCheck, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

function ResetPasswordPage() {
  const [form, setForm] = useState({ email: "", otp: "", password: "", confirmPassword: "" });
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function requestCode(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await apiRequest("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email: form.email }) });
      setMessage(response.message);
      setStep(2);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(event) {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await apiRequest("/auth/reset-password", { method: "POST", body: JSON.stringify({ email: form.email, otp: form.otp, password: form.password }) });
      navigate("/login?reset=success", { replace: true });
    } catch (resetError) {
      setError(resetError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-5 py-12">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl md:p-10">
        <Link to="/" className="mb-8 flex items-center justify-center gap-3 text-emerald-950">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-950 text-white"><Leaf size={24} /></span>
          <span className="font-serif text-2xl font-bold">EndemicLens</span>
        </Link>
        <div className="text-center">
          {step === 1 ? <MailCheck className="mx-auto text-emerald-800" size={38} /> : <ShieldCheck className="mx-auto text-emerald-800" size={38} />}
          <h1 className="mt-4 text-3xl font-black text-slate-900">{step === 1 ? "Reset your password" : "Enter your reset code"}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{step === 1 ? "We will send a six-digit code to your account email." : "The code expires in 10 minutes and can only be used once."}</p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={step === 1 ? requestCode : resetPassword}>
          <input type="email" name="email" value={form.email} onChange={updateField} placeholder="Email address" autoComplete="email" required disabled={step === 2} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700 disabled:bg-slate-100" />
          {step === 2 && <>
            <input type="text" name="otp" value={form.otp} onChange={updateField} placeholder="Six-digit code" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" required className="w-full rounded-xl border border-slate-300 px-4 py-3 tracking-[0.35em] outline-none focus:border-emerald-700" />
            <input type="password" name="password" value={form.password} onChange={updateField} placeholder="New password" autoComplete="new-password" minLength="8" required className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700" />
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={updateField} placeholder="Confirm new password" autoComplete="new-password" minLength="8" required className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700" />
          </>}
          {message && <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>}
          {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-emerald-950 px-5 py-3 font-bold text-white disabled:opacity-50">{loading ? "Please wait..." : step === 1 ? "Send reset code" : "Reset password"}</button>
        </form>
        <div className="mt-6 flex justify-between text-sm font-bold text-emerald-800">
          <Link to="/login" className="hover:underline">Back to login</Link>
          {step === 2 && <button type="button" onClick={() => { setStep(1); setMessage(""); setError(""); }} className="hover:underline">Use another email</button>}
        </div>
      </section>
    </main>
  );
}

export default ResetPasswordPage;
