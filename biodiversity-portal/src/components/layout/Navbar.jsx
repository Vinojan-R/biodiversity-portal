import { useState } from "react";
import { Leaf, Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 transition ${
      isActive
        ? "bg-emerald-700 text-white"
        : "text-emerald-100 hover:bg-emerald-800 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-emerald-950 shadow-lg">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-3 text-white"
          onClick={() => setMenuOpen(false)}
        >
          <Leaf className="text-emerald-400" size={32} />

          <div className="flex flex-col">
            <span className="text-lg font-bold">BiodiversityLK</span>
            <span className="text-xs text-emerald-200">
              Endemic Species Portal
            </span>
          </div>
        </Link>

        <button
          type="button"
          className="rounded-lg p-2 text-white md:hidden"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav
          className={`absolute top-18 left-0 w-full bg-emerald-950 px-4 pb-5 md:static md:flex md:w-auto md:items-center md:gap-2 md:p-0 ${
            menuOpen ? "block" : "hidden md:flex"
          }`}
        >
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/species" className={linkClass}>
            Species
          </NavLink>

          <NavLink to="/identify" className={linkClass}>
            Identify
          </NavLink>

          <NavLink to="/map" className={linkClass}>
            Map
          </NavLink>

          <NavLink to="/education" className={linkClass}>
            Learn
          </NavLink>

          <NavLink
            to="/login"
            className="mt-2 block rounded-lg bg-emerald-400 px-4 py-2 font-semibold text-emerald-950 transition hover:bg-emerald-300 md:mt-0"
          >
            Login
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;