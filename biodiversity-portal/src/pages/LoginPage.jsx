import {
  Eye,
  EyeOff,
  Leaf,
} from "lucide-react";
import { useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import loginWildlifeImage from "../assets/images/login-wildlife.png";
import { useAuth } from "../context/AuthContext";

function GoogleIcon() {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-lg font-black text-blue-600">
      G
    </span>
  );
}

function FacebookIcon() {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-lg font-black text-white">
      f
    </span>
  );
}

function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  function handleChange(event) {
    const { name, value, checked, type } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Please enter your username and password.");
      return;
    }

    // Temporary frontend authentication.
    // Replace this section with the Node.js login API later.
    login({
      name: formData.username,
      username: formData.username,
    });

    const destination = location.state?.from || "/home";

    navigate(destination, {
      replace: true,
    });
  }

  function handleSocialLogin(provider) {
    setError("");

    login({
      name: `${provider} User`,
      provider,
    });

    navigate("/home", {
      replace: true,
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#022e27] via-[#06483e] to-[#012b25] px-5 py-8 text-white">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="pointer-events-none absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-teal-300/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Logo */}
        <Link
          to="/"
          className="inline-flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-emerald-950 md:h-14 md:w-14">
            <Leaf size={28} />
          </div>

          <span className="font-serif text-3xl font-black tracking-tight md:text-5xl">
            EndemicLens
          </span>
        </Link>

        {/* Login container */}
        <section className="mx-auto mt-10 grid max-w-6xl overflow-hidden rounded-[45px] bg-white/10 shadow-2xl ring-1 ring-white/10 backdrop-blur-md lg:grid-cols-2">
          {/* Left login form */}
          <div className="bg-[#062f29]/95 px-7 py-12 sm:px-12 md:px-16 lg:min-h-[680px]">
            <div className="mx-auto max-w-md">
              <h1 className="text-center font-serif text-4xl font-black md:text-5xl">
                Sign in
              </h1>

              <form
                className="mt-14 space-y-7"
                onSubmit={handleSubmit}
              >
                <label className="block">
                  <span className="mb-2 block font-serif text-xl font-bold">
                    Username
                  </span>

                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    autoComplete="username"
                    className="w-full rounded-lg border border-transparent bg-slate-200 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-400/20"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block font-serif text-xl font-bold">
                    Password
                  </span>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full rounded-lg border border-transparent bg-slate-200 px-4 py-3.5 pr-12 text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-400/20"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-600 transition hover:text-emerald-800"
                    >
                      {showPassword ? (
                        <EyeOff size={21} />
                      ) : (
                        <Eye size={21} />
                      )}
                    </button>
                  </div>
                </label>

                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <label className="flex cursor-pointer items-center gap-3 font-serif text-lg">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-5 w-5 accent-emerald-400"
                    />

                    Remember the password
                  </label>

                  <button
                    type="button"
                    className="text-left text-sm font-semibold text-cyan-300 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {error && (
                  <p className="rounded-xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm text-red-100">
                    {error}
                  </p>
                )}

                <div className="text-center">
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-teal-300 to-emerald-600 px-12 py-3 font-serif text-2xl font-black text-black shadow-lg transition hover:-translate-y-0.5 hover:shadow-emerald-400/30 active:translate-y-0"
                  >
                    Sign in
                  </button>
                </div>
              </form>

              <p className="mt-8 text-center font-serif text-lg font-semibold">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="text-cyan-300 transition hover:text-cyan-200 hover:underline"
                >
                  Sign up
                </Link>
              </p>

              <div className="mt-3 flex items-center gap-4">
                <span className="h-px flex-1 bg-white/20" />

                <p className="font-serif text-lg font-bold">
                  Sign in using
                </p>

                <span className="h-px flex-1 bg-white/20" />
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handleSocialLogin("Google")}
                  className="flex items-center justify-center gap-3 rounded-lg bg-slate-100 px-4 py-3 font-serif text-sm font-bold text-slate-900 transition hover:bg-white"
                >
                  <GoogleIcon />
                  Sign in with Google
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin("Facebook")}
                  className="flex items-center justify-center gap-3 rounded-lg bg-slate-100 px-4 py-3 font-serif text-sm font-bold text-slate-900 transition hover:bg-white"
                >
                  <FacebookIcon />
                  Sign in with Facebook
                </button>
              </div>
            </div>
          </div>

          {/* Right welcome section */}
          <div className="relative hidden min-h-[680px] overflow-hidden bg-gradient-to-br from-[#205a51] via-[#15917f] to-[#17c9ad] lg:flex lg:flex-col">
            <div className="relative z-10 px-10 pt-16 text-center">
              <h2 className="text-5xl leading-[1.05] font-black text-black/90 xl:text-6xl">
                Hi! Welcome to
                <span className="block">EndemicLens</span>
              </h2>

              <p className="mx-auto mt-5 max-w-md text-base leading-7 text-black/70">
                Explore, identify and protect Sri Lanka&apos;s
                extraordinary endemic wildlife.
              </p>
            </div>

            <div className="relative mt-auto flex flex-1 items-end justify-center px-8 pb-12">
              <div className="absolute bottom-12 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />

              <img
                src={loginWildlifeImage}
                alt="Sri Lankan wildlife viewed through a magnifying glass"
                className="relative z-10 max-h-[430px] w-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;