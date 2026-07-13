import { useState } from "react";
import { Leaf, Menu, X, LogOut } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();

    navigate("/", {
      replace: true,
    });
  }

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 transition ${
      isActive
        ? "bg-emerald-700 text-white"
        : "text-emerald-100 hover:bg-emerald-800 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-emerald-950 shadow-lg">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-4">

        {/* Logo */}
        <Link
          to="/home"
          className="flex items-center gap-3 text-white"
          onClick={() => setMenuOpen(false)}
        >
          <Leaf className="text-emerald-400" size={32} />

          <div className="flex flex-col">
            <span className="text-lg font-bold">
              BiodiversityLK
            </span>

            <span className="text-xs text-emerald-200">
              Endemic Species Portal
            </span>
          </div>
        </Link>

        {/* Mobile button */}
        <button
          type="button"
          className="rounded-lg p-2 text-white md:hidden"
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        {/* Navigation */}
        <nav
          className={`absolute top-[72px] left-0 w-full bg-emerald-950 px-4 pb-5 md:static md:flex md:w-auto md:items-center md:gap-2 md:p-0 ${
            menuOpen ? "block" : "hidden md:flex"
          }`}
        >
          <NavLink
            to="/home"
            className={linkClass}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>

          <NavLink
            to="/species"
            className={linkClass}
            onClick={() => setMenuOpen(false)}
          >
            Species
          </NavLink>

          <NavLink
            to="/identify"
            className={linkClass}
            onClick={() => setMenuOpen(false)}
          >
            Identify
          </NavLink>

          <NavLink
            to="/map"
            className={linkClass}
            onClick={() => setMenuOpen(false)}
          >
            Map
          </NavLink>

          <NavLink
            to="/education"
            className={linkClass}
            onClick={() => setMenuOpen(false)}
          >
            Learn
          </NavLink>
          

          {/* User Name */}
          <div className="mt-4 border-t border-emerald-800 pt-4 md:mt-0 md:border-none md:pt-0">
            <p className="px-3 text-sm text-emerald-200">
              Welcome,
            </p>

            <p className="px-3 font-semibold text-white">
              {user?.name || "User"}
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-3 flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-semibold text-emerald-950 transition hover:bg-emerald-100 md:mt-0 md:ml-3"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;