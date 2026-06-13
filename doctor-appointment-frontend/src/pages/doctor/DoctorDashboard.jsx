import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import doctorService from '../../services/doctorService';
import { useToast } from '../../context/ToastContext';
import {
  Calendar,
  CheckCircle,
  Clock,
  Activity,
  FileText,
  Loader2
} from 'lucide-react';

const DoctorDashboard = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [todayAppts, setTodayAppts] = useState([]);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const today = await doctorService.getTodayAppointments();
        setTodayAppts(today);

        const upcoming = await doctorService.getUpcomingAppointments();
        setUpcomingCount(upcoming.length);
      } catch (err) {
        addToast('Failed to load dashboard parameters', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorData();
  }, [addToast]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await doctorService.updateAppointmentStatus(id, status);
      addToast(`Appointment ${status.toLowerCase()} successfully`, 'success');
      // Update state
      setTodayAppts((prev) =>
        prev.map((appt) => (appt.id === id ? { ...appt, status } : appt))
      );
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
      </div>
    );
  }

  // Calculate statistics
  const pendingToday = todayAppts.filter(a => a.status === 'PENDING').length;
  const acceptedToday = todayAppts.filter(a => a.status === 'ACCEPTED').length;
  const completedToday = todayAppts.filter(a => a.status === 'COMPLETED').length;

  const statCards = [
    {
      title: 'Today Appointments',
      value: todayAppts.length,
      icon: Activity,
      color: 'from-sky-500 to-blue-600',
      desc: 'Total consultations today'
    },
    {
      title: 'Pending Approvals',
      value: pendingToday,
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      desc: 'Requires review decision'
    },
    {
      title: 'Active Patients',
      value: acceptedToday,
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-500',
      desc: 'Accepted for today'
    },
    {
      title: 'Upcoming Bookings',
      value: upcomingCount,
      icon: Calendar,
      color: 'from-purple-500 to-indigo-600',
      desc: 'Scheduled future appointments'
    }
  ];

  // Abdul kareem 2500030144
  return (
    <div className="space-y-8 animate-slide-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Physician Agenda</h2>
        <p className="text-slate-400 text-sm mt-1">Review clinical queues, respond to schedulings, and complete notes</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200"
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
              <p className="text-xs text-slate-400 mt-4 italic">{card.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Today agenda preview */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800">Pending Actions Queue</h3>
            <p className="text-xs text-slate-400 mt-0.5">Consultations awaiting approval today</p>
          </div>
          <button
            onClick={() => navigate('/doctor/appointments/today')}
            className="text-xs font-bold text-sky-500 hover:text-sky-600 transition-colors"
          >
            View Full Queue
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {todayAppts.filter(a => a.status === 'PENDING').length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              All today's schedulings are reviewed! You have no pending approvals.
            </div>
          ) : (
            todayAppts
              .filter((a) => a.status === 'PENDING')
              .map((appt) => (
                <div key={appt.id} className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-850">{appt.patientName}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>Phone: {appt.patientPhone || 'N/A'}</span>
                      <span className="flex items-center gap-1 font-semibold text-sky-500">
                        <Clock className="w-3.5 h-3.5" />
                        {appt.timeSlot}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus(appt.id, 'ACCEPTED')}
                      className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl text-xs font-bold border border-emerald-100 transition-all"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(appt.id, 'REJECTED')}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold border border-rose-100 transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
