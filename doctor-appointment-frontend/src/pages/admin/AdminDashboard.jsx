import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  HeartPulse,
  Calendar,
  DollarSign,
  TrendingUp,
  Loader2
} from 'lucide-react';

const AdminDashboard = () => {
  const { addToast } = useToast();
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsData = await adminService.getDashboardStats();
        setStats(statsData);

        const appointmentsData = await adminService.getAllAppointments();
        setAppointments(appointmentsData.slice(-5).reverse()); // Get last 5 recent appointments
      } catch (err) {
        addToast('Failed to fetch dashboard metrics', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [addToast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Doctors',
      value: stats?.totalDoctors ?? 0,
      icon: Users,
      color: 'from-sky-500 to-blue-600',
      description: 'Active medical specialists'
    },
    {
      title: 'Registered Patients',
      value: stats?.totalPatients ?? 0,
      icon: HeartPulse,
      color: 'from-emerald-500 to-teal-600',
      description: 'Patients under clinical care'
    },
    {
      title: 'Today Appointments',
      value: stats?.appointmentsToday ?? 0,
      icon: Calendar,
      color: 'from-amber-500 to-orange-600',
      description: 'Consultations scheduled today'
    },
    {
      title: 'Salaries Paid',
      value: `$${(stats?.totalSalariesPaid ?? 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'from-purple-500 to-indigo-600',
      description: 'Total hospital salary outlays'
    }
  ];
// Abdul kareem 2500030144
  return (
    <div className="space-y-8 animate-slide-in">
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Hospital Insights</h2>
        <p className="text-slate-400 text-sm mt-1">Real-time indicators and operational oversight</p>
      </div>

      {/* METRICS GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md hover:scale-[1.01] transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
                  <h3 className="text-3xl font-extrabold text-slate-800 mt-2">{card.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-md shadow-slate-100`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-sky-500" />
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* RECENT APPOINTMENTS SECTION */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800">Recent Appointments</h3>
            <p className="text-xs text-slate-400 mt-0.5">Most recent doctor bookings submitted</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {appointments.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              No appointments scheduled yet.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{appt.patientName}</td>
                    <td className="px-6 py-4 text-slate-600">Dr. {appt.doctorName}</td>
                    <td className="px-6 py-4 text-slate-500">{appt.departmentName || 'General'}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <div>{appt.appointmentDate}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{appt.timeSlot}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                        appt.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        appt.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        appt.status === 'COMPLETED' ? 'bg-sky-50 text-sky-600 border border-sky-100' :
                        'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
