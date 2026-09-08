import { Eye, EyeOff, Leaf } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { googleSignInUrl } from "../services/api";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await register({ name: formData.name, email: formData.email, password: formData.password });
      navigate("/home", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-5 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl md:p-10">
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-3 text-emerald-950"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-950 text-white">
            <Leaf size={24} />
          </div>

          <span className="font-serif text-2xl font-bold">
            EndemicLens
          </span>
        </Link>

        <h1 className="text-center text-3xl font-black text-slate-900">
          Create your account
        </h1>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <button type="button" onClick={() => window.location.assign(googleSignInUrl)} className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-800 hover:bg-slate-50">
            <span className="text-lg font-black text-blue-600">G</span>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-400"><span className="h-px flex-1 bg-slate-200" />or use email<span className="h-px flex-1 bg-slate-200" /></div>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full name"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700"
          />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700"
          />

          <button type="button" onClick={() => setShowPassword((current) => !current)} className="-mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-800">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPassword ? "Hide password" : "Show password"}
          </button>

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700"
          />

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-950 px-5 py-3 font-bold text-white hover:bg-emerald-800"
          >
            Sign up
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-600">
          Already registered?{" "}
          <Link
            to="/login"
            className="font-bold text-emerald-800 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}

export default RegisterPage;