
import { Link } from "react-router-dom";
import { useState } from "react";
import { useChat } from "../context/ChatContext";
import logo from "../assets/Screenshot 2026-03-12 120942.jpg";

function Navbar() {
  const user = JSON.parse(localStorage.getItem('user'));
  const { unreadCount } = useChat();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => setShowLogoutConfirm(true);
  const handleCancelLogout = () => setShowLogoutConfirm(false);

  const handleConfirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-white shadow">
      <div className="flex items-center gap-2 ml-6 text-2xl font-bold text-blue-600">
        <Link to="/">
          <img src={logo} alt="logo" className="h-12" />
        </Link>
      </div>

      <ul className="hidden md:flex gap-8 text-gray-700 font-medium">
        <li className="hover:text-blue-600 hover:border-b-2 hover:border-blue-600 cursor-pointer">
          <Link to="/" className="text-inherit no-underline">Home</Link>
        </li>
        {user?.role === 'admin' ? (
          <>
            <li className="hover:text-blue-600 hover:border-b-2 hover:border-blue-600 cursor-pointer">
              <Link to="/companies" className="text-inherit no-underline">Manage Companies</Link>
            </li>
            <li className="hover:text-blue-600 hover:border-b-2 hover:border-blue-600 cursor-pointer">
              <Link to="/admin/users" className="text-inherit no-underline">Registered Users</Link>
            </li>
            <li className="hover:text-blue-600 hover:border-b-2 hover:border-blue-600 cursor-pointer">
              <Link to="/admin/stats" className="text-inherit no-underline">System Statistics</Link>
            </li>
            <li className="hover:text-blue-600 hover:border-b-2 hover:border-blue-600 cursor-pointer">
              <Link to="/messages" className="text-inherit no-underline">Messages</Link>
            </li>
          </>
        ) : user?.role === 'company' ? (
          <>
            <li className="hover:text-blue-600 hover:border-b-2 hover:border-blue-600 cursor-pointer">
              <Link to="/company-dashboard" className="text-inherit no-underline">Dashboard</Link>
            </li>
            <li className="hover:text-blue-600 hover:border-b-2 hover:border-blue-600 cursor-pointer">
              <Link to="/company-applications" className="text-inherit no-underline">Applicants Inbox</Link>
            </li>
            <li className="hover:text-blue-600 hover:border-b-2 hover:border-blue-600 cursor-pointer">
              <Link to="/admin/users" className="text-inherit no-underline">Registered Workers</Link>
            </li>
            <li className="hover:text-blue-600 hover:border-b-2 hover:border-blue-600 cursor-pointer">
              <Link to="/messages" className="text-inherit no-underline">Messages</Link>
            </li>
            <li className="hover:text-blue-600 hover:border-b-2 hover:border-blue-600 cursor-pointer">
              <Link to="/companies" className="text-inherit no-underline">Companies</Link>
            </li>
          </>
        ) : (
          <>
            <li className="hover:text-blue-600 hover:border-b-2 hover:border-blue-600 cursor-pointer">
              <Link to="/applications" className="text-inherit no-underline">My Applications</Link>
            </li>
            <li className="hover:text-blue-600 hover:border-b-2 hover:border-blue-600 cursor-pointer">
              <Link to="/messages" className="text-inherit no-underline">Messages</Link>
            </li>
            <li className="hover:text-blue-600 hover:border-b-2 hover:border-blue-600 cursor-pointer">
              <Link to="/companies" className="text-inherit no-underline">Companies</Link>
            </li>
            <li className="hover:text-blue-600 hover:border-b-2 hover:border-blue-600 cursor-pointer">
              <Link to="/contact" className="text-inherit no-underline">Contact Us</Link>
            </li>
          </>
        )}
      </ul>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <Link to="/profile" className="text-blue-600 hover:underline font-bold mr-2">
              Hello, {user.name}
            </Link>
            {unreadCount > 0 && (
              <Link to="/messages" className="relative group">
                <span className="text-2xl">💬</span>
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white animate-pulse">
                  {unreadCount}
                </span>
              </Link>
            )}
            <button
               onClick={handleLogoutClick}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg">
              Login
            </Link>
            <Link to="/signup" className="border border-blue-600 hover:bg-blue-100 text-blue-600 px-6 py-2 rounded-lg transition-colors">
              Sign In
            </Link>
          </>
        )}
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 max-w-sm w-full mx-4 transform transition-all">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-3xl">⚠️</div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Logout Comparison</h3>
            <p className="text-gray-500 text-center mb-8">Are you sure you want to logout? You will need to login again to apply for jobs.</p>
            <div className="flex gap-4">
              <button
                onClick={handleCancelLogout}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-800 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

