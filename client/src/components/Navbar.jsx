import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  X,
  LogOut,
  Home,
  BarChart3,
  Users,
  Trophy,
  Heart
} from 'lucide-react';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      
      {/* TOP NAV */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <div className="flex items-center space-x-4">
            <button
              className="md:hidden p-2 -ml-1 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>

            <Link
              to="/"
              className="flex items-center space-x-2 font-bold text-xl text-primary-600"
            >
              <Trophy size={24} />
              <span>GolfCharity</span>
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1 text-gray-700 hover:text-primary-600"
                >
                  <Home size={18} />
                  Dashboard
                </Link>
<Link to="/scores">Scores</Link>

                <Link
                  to="/subscription"
                  className="flex items-center gap-1 text-gray-700 hover:text-primary-600"
                >
                  <Heart size={18} />
                  Subscription
                </Link>

                <Link
                  to="/draws"
                  className="flex items-center gap-1 text-gray-700 hover:text-primary-600"
                >
                  <Users size={18} />
                  Draws
                </Link>
<button
  onClick={logout}
  className="bg-red-500 text-white px-4 py-2 rounded"
>
  Logout
</button>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 text-gray-700 hover:text-primary-600"
                  >
                    <BarChart3 size={18} />
                    Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-700 hover:text-red-500"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary text-sm">
                Login
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`md:hidden fixed left-0 top-0 h-full w-64 bg-white shadow-2xl transform transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } z-50 p-6`}
      >
        <button
          className="absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={20} />
        </button>

        <nav className="mt-12 space-y-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-lg hover:text-primary-600"
            onClick={() => setSidebarOpen(false)}
          >
            <Home size={20} />
            Dashboard
          </Link>

          <Link
            to="/scores"
            className="flex items-center gap-3 text-lg hover:text-primary-600"
            onClick={() => setSidebarOpen(false)}
          >
            <Trophy size={20} />
            Scores
          </Link>

          <Link
            to="/subscription"
            className="flex items-center gap-3 text-lg hover:text-primary-600"
            onClick={() => setSidebarOpen(false)}
          >
            <Heart size={20} />
            Subscription
          </Link>

          <Link
            to="/draws"
            className="flex items-center gap-3 text-lg hover:text-primary-600"
            onClick={() => setSidebarOpen(false)}
          >
            <Users size={20} />
            Draws
          </Link>

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="flex items-center gap-3 text-lg hover:text-primary-600"
              onClick={() => setSidebarOpen(false)}
            >
              <BarChart3 size={20} />
              Admin
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-lg text-red-600 hover:text-red-700"
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </div>
    </nav>
  );
};

export default Navbar;