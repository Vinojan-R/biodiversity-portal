import { Leaf } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

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

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Temporary registration.
    // Replace this with your backend API later.
    login({
      name: formData.name,
      email: formData.email,
    });

    navigate("/home", {
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

        <h1 className="text-center text-3xl font-black text-slate-900">
          Create your account
        </h1>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700"
          />

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