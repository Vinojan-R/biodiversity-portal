import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

function LandingNavbar() {
  return (
    <header className="absolute top-0 left-0 z-50 w-full">
      <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-full bg-emerald-950/90 px-6 py-3 backdrop-blur">

        <Link
          to="/"
          className="flex items-center gap-3 text-white"
        >
          <Leaf
            className="text-emerald-300"
            size={32}
          />

          <span className="text-2xl font-bold">
            EndemicLens
          </span>
        </Link>

        <div className="flex gap-3">

          <Link
            to="/login"
            className="rounded-full bg-white px-5 py-2 font-semibold text-emerald-950"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-full border border-white px-5 py-2 text-white transition hover:bg-white hover:text-emerald-950"
          >
            Sign Up
          </Link>

        </div>
      </div>
    </header>
  );
}

export default LandingNavbar;