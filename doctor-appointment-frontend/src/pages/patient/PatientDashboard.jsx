import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import patientService from '../../services/patientService';
import { useToast } from '../../context/ToastContext';
import { Calendar, Activity, Clock, CheckCircle, Pill, Loader2, ArrowRight } from 'lucide-react';

const PatientDashboard = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await patientService.getAppointmentHistory();
        setAppointments(data);
      } catch (err) {
        addToast('Failed to load patient history parameters', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [addToast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
      </div>
    );
  }

  // Find next active appointment
  const activeAppts = appointments
    .filter((a) => a.status === 'PENDING' || a.status === 'ACCEPTED')
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
  
  const nextAppt = activeAppts.length > 0 ? activeAppts[0] : null;

  // Stats count
  const totalBookings = appointments.length;
  const completedBookings = appointments.filter(a => a.status === 'COMPLETED').length;
  const cancelledBookings = appointments.filter(a => a.status === 'CANCELLED').length;

  // Abdul kareem 2500030144
  return (
    <div className="space-y-8 animate-slide-in">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-sky-500 via-primary-600 to-indigo-650 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        <div className="space-y-3 relative z-10">
          <h2 className="text-3xl font-extrabold tracking-tight">Your Care Portal</h2>
          <p className="text-sky-100 text-sm max-w-md">
            Easily browse specialists, book consultations, review prescriptions, and track your clinical timeline.
          </p>
        </div>
        <button
          onClick={() => navigate('/patient/book')}
          className="px-6 py-3 bg-white text-primary-700 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-lg text-sm self-start md:self-auto flex items-center gap-2 group active:scale-[0.98]"
        >
          Book Consultation
          <ArrowRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* STATS SUMMARY CARD */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6 md:col-span-1">
          <div>
            <h3 className="font-extrabold text-slate-800 text-md">My Records Summary</h3>
            <p className="text-xs text-slate-450">Historical consultation statistics</p>
          </div>
          
          <div className="space-y-4">
            {/* Total Booked */}
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500 font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-500" /> Total Bookings
              </span>
              <span className="text-sm font-bold text-slate-800">{totalBookings}</span>
            </div>

            {/* Completed */}
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500 font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Completed
              </span>
              <span className="text-sm font-bold text-slate-800">{completedBookings}</span>
            </div>

            {/* Cancelled */}
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-sm text-slate-500 font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500" /> Cancelled
              </span>
              <span className="text-sm font-bold text-slate-800">{cancelledBookings}</span>
            </div>
          </div>
        </div>

        {/* UPCOMING CONSULTATION HIGHLIGHT */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800 text-md">Next Consultation</h3>
            <p className="text-xs text-slate-450 mt-0.5">Your upcoming visit details</p>
          </div>

          <div className="flex-1 flex flex-col justify-center py-6">
            {nextAppt ? (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-slate-800">Dr. {nextAppt.doctorName}</h4>
                    <p className="text-xs text-sky-600 font-bold tracking-wide mt-1 uppercase">{nextAppt.specialization}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{nextAppt.departmentName}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase ${
                    nextAppt.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {nextAppt.status}
                  </span>
                </div>

                <div className="flex items-center gap-6 border-t border-slate-200/60 pt-4 text-sm text-slate-650">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Calendar className="w-4 h-4 text-sky-500" />
                    {nextAppt.appointmentDate}
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Clock className="w-4 h-4 text-sky-500" />
                    {nextAppt.timeSlot}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm italic">
                You have no upcoming consultations scheduled.
              </div>
            )}
          </div>
          <button
            onClick={() => navigate('/patient/history')}
            className="text-xs font-bold text-sky-500 hover:text-sky-600 transition-colors self-start"
          >
            View Consultation History
          </button>
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;
