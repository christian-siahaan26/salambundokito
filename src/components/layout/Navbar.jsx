import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardRoute = () => {
    if (!user) return "/";
    const routes = {
      OWNER: "/owner/dashboard",
      ADMIN: "/admin/dashboard",
      DRIVER: "/driver/dashboard",
      CUSTOMER: "/customer/dashboard",
    };
    return routes[user.role] || "/";
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Gas 3Kg</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 transition"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-primary-600 transition"
            >
              Tentang
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-primary-600 transition"
            >
              Kontak
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardRoute()}
                  className="text-gray-700 hover:text-primary-600 transition"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-3 ml-4">
                  <span className="text-sm text-gray-600 font-medium">
                    {user?.name || user?.email}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                {/* Tombol Register Ditambahkan */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/register")}
                >
                  Register
                </Button>
                <Button size="sm" onClick={() => navigate("/login")}>
                  Login
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t bg-white">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary-600 transition px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-primary-600 transition px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Tentang
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-primary-600 transition px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Kontak
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardRoute()}
                    className="text-gray-700 hover:text-primary-600 transition px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="px-4 py-2 border-t mt-2">
                    <p className="text-sm text-gray-600 mb-3 font-medium">
                      Halo, {user?.name || user?.email}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="px-4 py-2 grid grid-cols-2 gap-3">
                  {/* Tombol Mobile Register */}
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      navigate("/register");
                      setIsMenuOpen(false);
                    }}
                  >
                    Register
                  </Button>
                  <Button
                    size="sm"
                    fullWidth
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
