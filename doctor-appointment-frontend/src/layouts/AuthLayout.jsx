import React from 'react';
import { HeartPulse } from 'lucide-react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2 min-h-[550px] border border-slate-100">
        
        {/* BRANDING SIDE PANEL */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-slate-800 to-primary-950 text-white relative overflow-hidden">
          {/* Subtle light blobs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />

          {/* Logo */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-wide bg-gradient-to-r from-sky-400 to-white bg-clip-text text-transparent">
              CareFlow
            </span>
          </div>

          {/* Slogan */}
          <div className="relative z-10 my-auto space-y-4">
            <h2 className="text-3xl font-extrabold leading-tight">
              Empowering healthcare management, simplified.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Experience seamless doctor-patient connections, smart scheduling, secure records, and instant analytics designed for modern hospitals.
            </p>
          </div>

          {/* Copyright/Footer */}
          <div className="text-xs text-slate-500 relative z-10">
            &copy; {new Date().getFullYear()} CareFlow Hospital Group. All rights reserved.
          </div>
        </div>

        {/* FORM CONTAINER */}
        <div className="flex flex-col justify-center p-8 sm:p-12 md:p-16 bg-white">
          <div className="w-full max-w-md mx-auto">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;
