import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Bell, Plus, LogOut, User as UserIcon, Menu, X,
  Package, LayoutDashboard, MessageCircle
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { Avatar } from '@/components/ui/Avatar';
import { cx } from '@/utils/helpers';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications } = useApp();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const unread = notifications.filter((n) => !n.read).length;

  const links = [
    { to: '/browse', label: 'Browse' },
    { to: '/chat', label: 'Messages' },
    { to: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-ink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-lg font-bold text-ink-950">Campus Bazaar</span>
          </Link>

          {/* Nav Links */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    cx(
                      'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-ink-600 hover:bg-ink-100'
                    )
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">

            {isAuthenticated ? (
              <>
                <Link
                  to="/create-listing"
                  className="hidden sm:inline-flex btn-purple !py-2 !px-4 text-xs"
                >
                  <Plus size={16} /> Sell
                </Link>

                <Link
                  to="/notifications"
                  className="relative p-2.5 rounded-xl hover:bg-ink-100 transition-colors"
                >
                  <Bell size={18} />
                  {unread > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full ring-2 ring-white" />
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setOpenProfile((s) => !s)}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-ink-100 transition-colors"
                  >
                    <Avatar src={user?.avatar} name={user?.name} size={32} />
                  </button>

                  <AnimatePresence>
                    {openProfile && (
                      <>
                        <div
                          className="fixed inset-0 z-30"
                          onClick={() => setOpenProfile(false)}
                        />

                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-ink-100 shadow-soft-lg z-40 overflow-hidden"
                        >
                          <div className="p-4 border-b border-ink-100">
                            <p className="font-semibold text-ink-900">{user?.name}</p>
                            <p className="text-xs text-ink-500 truncate">{user?.email}</p>
                          </div>

                          <div className="py-1">
                            <MenuLink
                              icon={<UserIcon size={16} />}
                              label="My Profile"
                              onClick={() => {
                                setOpenProfile(false);

                                if (user?._id) {
                                  navigate(`/profile/${user._id}`);
                                }
                              }}
                            />

                            <MenuLink
                              icon={<Package size={16} />}
                              label="My Listings"
                              onClick={() => {
                                setOpenProfile(false);
                                navigate('/my-listings');
                              }}
                            />

                            <MenuLink
                              icon={<LayoutDashboard size={16} />}
                              label="Dashboard"
                              onClick={() => {
                                setOpenProfile(false);
                                navigate('/dashboard');
                              }}
                            />

                            <MenuLink
                              icon={<MessageCircle size={16} />}
                              label="Messages"
                              onClick={() => {
                                setOpenProfile(false);
                                navigate('/chat');
                              }}
                            />
                          </div>

                          <div className="border-t border-ink-100 py-1">
                            <button
                              onClick={() => {
                                setOpenProfile(false);
                                logout();
                                navigate('/');
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <LogOut size={16} /> Logout
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  className="md:hidden p-2.5 rounded-xl hover:bg-ink-100"
                  onClick={() => setOpenMenu((s) => !s)}
                >
                  {openMenu ? <X size={18} /> : <Menu size={18} />}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost hidden sm:inline-flex">
                  Log in
                </Link>
                <Link to="/signup" className="btn-purple">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {openMenu && isAuthenticated && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-ink-100"
            >
              <div className="py-2 space-y-1">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpenMenu(false)}
                    className={({ isActive }) =>
                      cx(
                        'block px-4 py-2.5 rounded-xl text-sm font-medium',
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-ink-700 hover:bg-ink-100'
                      )
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

function MenuLink({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 transition-colors"
    >
      {icon} {label}
    </button>
  );
}