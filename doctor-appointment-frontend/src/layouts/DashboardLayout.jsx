import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Building2,
  Calendar,
  HeartPulse,
  DollarSign,
  Clock,
  Pill,
  LogOut,
  Menu,
  X,
  UserCheck,
  FileText
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  // Sidebar navigation links based on roles
  const navItems = {
    ADMIN: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Add Doctor', path: '/admin/add-doctor', icon: UserPlus },
      { name: 'Manage Doctors', path: '/admin/doctors', icon: Users },
      { name: 'Departments', path: '/admin/departments', icon: Building2 },
      { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
      { name: 'Patients', path: '/admin/patients', icon: HeartPulse },
      { name: 'Salaries', path: '/admin/salaries', icon: DollarSign },
      { name: 'Reports', path: '/admin/reports', icon: FileText },
    ],
    DOCTOR: [
      { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
      { name: 'Today Appointments', path: '/doctor/appointments/today', icon: UserCheck },
      { name: 'Upcoming Appointments', path: '/doctor/appointments/upcoming', icon: Calendar },
      { name: 'Schedule', path: '/doctor/schedule', icon: Clock },
      { name: 'Prescriptions', path: '/doctor/prescriptions', icon: Pill },
      { name: 'Reports', path: '/doctor/reports', icon: FileText },
    ],
    PATIENT: [
      { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
      { name: 'Doctors', path: '/patient/doctors', icon: Users },
      { name: 'Book Appointment', path: '/patient/book', icon: Calendar },
      { name: 'Appointment History', path: '/patient/history', icon: Clock },
      { name: 'Reports', path: '/patient/reports', icon: FileText },
    ]
  };

  const currentNav = navItems[user.role] || [];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-100 shrink-0 border-r border-slate-800 shadow-xl">
        {/* Brand Logo */}
        <div className="h-16 flex items-center gap-3 px-6 bg-slate-950 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-sky-400 to-white bg-clip-text text-transparent">
            CareFlow
          </span>
        </div>

        {/* User Info Header */}
        <div className="p-5 border-b border-slate-800/60 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-primary-600 flex items-center justify-center font-bold text-white shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-white truncate max-w-[140px]">{user.name}</p>
              <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400 px-2 py-0.5 bg-sky-950/80 rounded-full border border-sky-800/40">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-primary-600 text-white shadow-md shadow-sky-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                }`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium text-rose-400 hover:text-white hover:bg-rose-950/30 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR MODAL */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          
          <aside className="relative flex flex-col w-64 bg-slate-900 text-slate-100 shadow-2xl z-50 animate-slide-in">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">CareFlow</span>
            </div>

            <div className="p-5 border-b border-slate-800 bg-slate-950/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-primary-600 flex items-center justify-center font-bold text-white">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <span className="text-[10px] uppercase font-bold text-sky-400">{user.role}</span>
                </div>
              </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
              {currentNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-sky-500 to-primary-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800">
              <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium text-rose-400 hover:text-white hover:bg-rose-950/30 rounded-xl transition-all"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* NAVBAR */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-800 capitalize hidden sm:block">
              {location.pathname.split('/').pop().replace(/-/g, ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-800">{user.name}</p>
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">{user.role}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm border border-sky-200">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* CONTAINER FOR CHILDREN PAGES */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
