import React, { useState, useEffect } from 'react';
import patientService from '../../services/patientService';
import { useToast } from '../../context/ToastContext';
import { Clock, Calendar, Pill, Trash, Loader2 } from 'lucide-react';

const PatientHistory = () => {
  const { addToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active view prescription details
  const [viewingRx, setViewingRx] = useState(null);

  const fetchHistory = async () => {
    try {
      const data = await patientService.getAppointmentHistory();
      setAppointments(data.reverse()); // Show newest first
    } catch (err) {
      addToast('Failed to fetch appointment log history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [addToast]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment request? This will release the doctor slot.')) {
      return;
    }

    try {
      await patientService.cancelAppointment(id);
      addToast('Appointment cancelled successfully', 'success');
      // Update state status
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? { ...appt, status: 'CANCELLED' } : appt))
      );
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to cancel appointment';
      addToast(errMsg, 'error');
    }
  };

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
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Appointment History</h2>
        <p className="text-slate-400 text-sm mt-1">Review active, historical and cancelled medical schedulings</p>
      </div>

      {/* Main List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {appointments.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            You have not booked any appointments in the system yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Specialization</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time Slot</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Prescription</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-850">
                      Dr. {appt.doctorName}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-semibold">{appt.specialization}</td>
                    <td className="px-6 py-4 text-slate-650">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-4 h-4 text-sky-500" />
                        {appt.appointmentDate}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 ml-5.5">{appt.timeSlot}</div>
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
                    {/* Prescription Details */}
                    <td className="px-6 py-4">
                      {appt.prescription ? (
                        <button
                          onClick={() => setViewingRx(appt.prescription)}
                          className="px-3 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold border border-sky-100 rounded-lg text-xs flex items-center gap-1 transition-all"
                        >
                          <Pill className="w-3.5 h-3.5" />
                          View Rx
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {(appt.status === 'PENDING' || appt.status === 'ACCEPTED') && (
                        <button
                          onClick={() => handleCancel(appt.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Cancel Appointment"
                        >
                          <Trash className="w-4.5 h-4.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PRESCRIPTION LIGHTBOX MODAL */}
      {viewingRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-slide-in">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg">My Prescription Card</h3>
                <p className="text-xs text-slate-400 mt-0.5">Advice and dosages provided by your physician</p>
              </div>
              <button
                onClick={() => setViewingRx(null)}
                className="text-lg font-bold text-slate-400 hover:text-slate-600"
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                <div>
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Medicines Details</h5>
                  <p className="text-sm font-semibold text-slate-800 mt-1 whitespace-pre-wrap">{viewingRx.medicineDetails}</p>
                </div>

                <div className="border-t border-slate-200/60 pt-3">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">General Advice Notes</h5>
                  <p className="text-sm text-slate-600 mt-1 italic whitespace-pre-wrap">{viewingRx.notes || 'None.'}</p>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setViewingRx(null)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientHistory;
