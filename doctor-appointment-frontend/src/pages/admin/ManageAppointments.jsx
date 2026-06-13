import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Calendar, Loader2 } from 'lucide-react';

const ManageAppointments = () => {
  const { addToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await adminService.getAllAppointments();
        setAppointments(data.reverse()); // Show newest first
      } catch (err) {
        addToast('Failed to fetch appointments list', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
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
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Appointments</h2>
        <p className="text-slate-400 text-sm mt-1">Audit and review all hospital consultations scheduled</p>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {appointments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No appointments booked in the system yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Doctor Assigned</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Specialty & Dept</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time Slot</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Prescription</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{appt.patientName}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{appt.patientEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700">Dr. {appt.doctorName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-600 font-semibold">{appt.specialization}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{appt.departmentName || 'General'}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-650">
                      <div className="flex items-center gap-1.5 font-medium text-slate-750">
                        <Calendar className="w-4 h-4 text-sky-500" />
                        {appt.appointmentDate}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 ml-5">{appt.timeSlot}</div>
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
                    <td className="px-6 py-4 text-slate-550 max-w-[200px] truncate">
                      {appt.prescription ? (
                        <div>
                          <div className="font-semibold text-slate-750">{appt.prescription.medicineDetails}</div>
                          <div className="text-xs text-slate-400 italic mt-0.5">{appt.prescription.notes || 'No extra notes.'}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">None</span>
                      )}
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

export default ManageAppointments;
