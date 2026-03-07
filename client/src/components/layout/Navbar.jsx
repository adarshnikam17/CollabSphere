import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { Code2, LogOut, User, LayoutDashboard, PlusCircle, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className="border-b border-gray-800 bg-gray-950 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
          <Code2 className="text-violet-500" size={28} />
          <span>Collab<span className="text-violet-500">Sphere</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link to="/create-project" className="flex items-center gap-1 text-sm text-gray-300 hover:text-violet-400 transition">
                <PlusCircle size={16} /> New Project
              </Link>
              <Link to="/dashboard" className="flex items-center gap-1 text-sm text-gray-300 hover:text-violet-400 transition">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link to="/profile" className="flex items-center gap-1 text-sm text-gray-300 hover:text-violet-400 transition">
                <User size={16} /> {user.name}
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-300 hover:text-white transition">Login</Link>
              <Link to="/register" className="text-sm bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg transition">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden text-gray-300" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4 flex flex-col gap-4">
          {user ? (
            <>
              <Link to="/create-project" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-gray-300 hover:text-violet-400 transition">
                <PlusCircle size={16} /> New Project
              </Link>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-gray-300 hover:text-violet-400 transition">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-gray-300 hover:text-violet-400 transition">
                <User size={16} /> {user.name}
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm text-gray-300 hover:text-white transition">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="text-sm bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg text-center transition">
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}