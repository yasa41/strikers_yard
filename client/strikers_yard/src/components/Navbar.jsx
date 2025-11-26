import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { isLoggedIn } from "../services/is_logged_in";

export default function Navbar({ openLogin }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const loggedIn = isLoggedIn();

  // Listen for login/logout updates
  useEffect(() => {
    const handler = () => {
      setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    };
    window.addEventListener("authChanged", handler);
    return () => window.removeEventListener("authChanged", handler);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    window.dispatchEvent(new Event("authChanged"));
    window.location.href = "/";
  };

  return (
    <div className="backdrop-blur-xl bg-white/30 border-b border-white/20 shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Book My Turf
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-6 ml-10">
          <Link to="/" className="font-medium text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/booking" className="font-medium text-gray-700 hover:text-blue-600">Book Turf</Link>
          <Link to="/my-bookings" className="font-medium text-gray-700 hover:text-blue-600">My Bookings</Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-4">

          {!loggedIn ? (
            // LOGIN BUTTON (desktop)
            <button
              onClick={openLogin}
              className="font-medium text-gray-700 hover:text-blue-600"
            >
              Login
            </button>
          ) : (
            // USERNAME + LOGOUT BUTTON
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="font-semibold text-gray-800 hover:text-blue-600"
              >
                {user?.name || "User"}
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-full hover:bg-red-100 text-red-600"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* MOBILE DROPDOWN MENU */}
      {open && (
        <div className="md:hidden bg-white/50 backdrop-blur-xl border-t border-white/20 py-4 px-6 space-y-4">

          <Link to="/" className="block font-medium text-gray-700" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link to="/booking" className="block font-medium text-gray-700" onClick={() => setOpen(false)}>
            Book Turf
          </Link>
          <Link to="/my-bookings" className="block font-medium text-gray-700" onClick={() => setOpen(false)}>
            My Bookings
          </Link>

          {!loggedIn ? (
            <button
              onClick={() => { setOpen(false); openLogin(); }}
              className="block font-medium text-gray-700"
            >
              Login
            </button>
          ) : (
            <div className="flex items-center justify-between">
            <Link
              to="/profile"
              className="font-semibold text-gray-800 hover:text-blue-600"
            >
              {user?.name || "User"}
            </Link>
              <button
                onClick={logout}
                className="text-red-600 font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
