import { Leaf } from "lucide-react";
import { useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    // Temporary demo authentication.
    // Replace this with a Node.js API request later.
    login({
      name: formData.email.split("@")[0],
      email: formData.email,
    });

    const destination = location.state?.from || "/home";

    navigate(destination, {
      replace: true,
    });
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

        <div className="text-center">
          <h1 className="text-3xl font-black text-slate-900">
            Welcome back
          </h1>

          <p className="mt-2 text-slate-600">
            Login to access the biodiversity portal.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block font-semibold text-slate-700">
              Email address
            </span>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-700 focus:ring-3 focus:ring-emerald-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block font-semibold text-slate-700">
              Password
            </span>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-700 focus:ring-3 focus:ring-emerald-100"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-950 px-5 py-3 font-bold text-white transition hover:bg-emerald-800"
          >
            Login
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-emerald-800 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;