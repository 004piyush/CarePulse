import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, ROLE_LABELS } from '../context/AuthContext';
import {
  LayoutDashboard,
  ClipboardList,
  LogOut,
  Menu,
  X,
  Shield,
  Activity,
  UserCircle,
  Stethoscope,
  Users
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout, ROLES } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [ROLES.TRIAGE, ROLES.ICU_MANAGER, ROLES.ADMIN] },
    { path: '/audit', label: 'Audit Log', icon: ClipboardList, roles: [ROLES.ICU_MANAGER, ROLES.ADMIN] },
    { path: '/users', label: 'User Directory', icon: Users, roles: [ROLES.ADMIN] },
  ];

  const filteredNavItems = navItems.filter((item) => item.roles.includes(user?.role));

  const roleColors = {
    [ROLES.TRIAGE]: 'bg-rose-100 text-rose-700 border-rose-200',
    [ROLES.ICU_MANAGER]: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    [ROLES.ADMIN]: 'bg-purple-100 text-purple-700 border-purple-200',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="flex items-center gap-2">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900 leading-tight">MedFlow</h1>
                  <p className="text-xs text-slate-500 leading-tight">CarePulse Bed Management</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${roleColors[user?.role] || ''}`}>
                {user?.role === ROLES.TRIAGE && <Stethoscope className="w-3.5 h-3.5" />}
                {user?.role === ROLES.ICU_MANAGER && <Shield className="w-3.5 h-3.5" />}
                {user?.role === ROLES.ADMIN && <UserCircle className="w-3.5 h-3.5" />}
                {ROLE_LABELS[user?.role]}
              </div>

              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
                <UserCircle className="w-4 h-4" />
                <span className="font-medium">{user?.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar Navigation */}
        <aside
          className={`
            fixed lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 z-30
            transition-transform duration-200 ease-in-out
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <nav className="p-4 space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;