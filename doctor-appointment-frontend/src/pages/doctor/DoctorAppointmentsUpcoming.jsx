import React, { useState, useEffect } from 'react';
import doctorService from '../../services/doctorService';
import { useToast } from '../../context/ToastContext';
import { Clock, Calendar, Heart, Loader2 } from 'lucide-react';

const DoctorAppointmentsUpcoming = () => {
  const { addToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const data = await doctorService.getUpcomingAppointments();
        setAppointments(data);
      } catch (err) {
        addToast('Failed to fetch upcoming schedule', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, [addToast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
      </div>
    );
  }

  // Abdul kareem 2500030144
  return (
    <div className="space-y-8 animate-slide-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Upcoming Appointments</h2>
        <p className="text-slate-400 text-sm mt-1">Review future bookings scheduled by patients</p>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {appointments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No upcoming appointments scheduled.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time Slot</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-rose-500/80" />
                        {appt.patientName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      <div>{appt.patientEmail}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{appt.patientPhone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-4 h-4 text-sky-500" />
                        {appt.appointmentDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-650">
                      <div className="flex items-center gap-1 font-semibold text-sky-600">
                        <Clock className="w-4 h-4" />
                        {appt.timeSlot}
                      </div>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointmentsUpcoming;
