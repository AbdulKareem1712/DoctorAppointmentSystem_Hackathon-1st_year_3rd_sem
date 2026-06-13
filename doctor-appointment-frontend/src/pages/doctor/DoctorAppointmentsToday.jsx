import React, { useState, useEffect } from 'react';
import doctorService from '../../services/doctorService';
import { useToast } from '../../context/ToastContext';
import { Clock, Check, X, FileText, Loader2, Heart, Pill } from 'lucide-react';

const DoctorAppointmentsToday = () => {
  const { addToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Prescription Modal States
  const [prescribingApptId, setPrescribingApptId] = useState(null);
  const [medicineDetails, setMedicineDetails] = useState('');
  const [notes, setNotes] = useState('');
  const [submittingPrescription, setSubmittingPrescription] = useState(false);

  const fetchTodayAppointments = async () => {
    try {
      const data = await doctorService.getTodayAppointments();
      setAppointments(data);
    } catch (err) {
      addToast('Failed to fetch today\'s schedule queue', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayAppointments();
  }, [addToast]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await doctorService.updateAppointmentStatus(id, status);
      addToast(`Appointment ${status.toLowerCase()} successfully!`, 'success');
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? { ...appt, status } : appt))
      );
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  const openPrescriptionModal = (id) => {
    setPrescribingApptId(id);
    setMedicineDetails('');
    setNotes('');
  };

  const closePrescriptionModal = () => {
    setPrescribingApptId(null);
  };

  const handlePrescribeSubmit = async (e) => {
    e.preventDefault();
    if (!medicineDetails.trim()) {
      addToast('Please provide medicine details', 'warning');
      return;
    }

    setSubmittingPrescription(true);
    try {
      const rx = await doctorService.completeAppointment(prescribingApptId, {
        medicineDetails,
        notes
      });
      addToast('Prescription logged and appointment completed successfully!', 'success');
      
      // Update local state to show COMPLETED with the prescription
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === prescribingApptId
            ? { ...appt, status: 'COMPLETED', prescription: rx }
            : appt
        )
      );
      closePrescriptionModal();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to submit prescription';
      addToast(errMsg, 'error');
    } finally {
      setSubmittingPrescription(false);
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
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Today's Appointments</h2>
        <p className="text-slate-400 text-sm mt-1">Accept pending requests, prescribe medicines, and review today's schedule</p>
      </div>

      {/* Main Queue */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {appointments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No appointments scheduled for today.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Scheduled Slot</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Patient */}
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-rose-500 fill-rose-500/10" />
                        {appt.patientName}
                      </div>
                    </td>
                    {/* Contact */}
                    <td className="px-6 py-4 text-slate-500">
                      <div>{appt.patientEmail}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{appt.patientPhone || 'No phone'}</div>
                    </td>
                    {/* Slot */}
                    <td className="px-6 py-4 text-slate-650">
                      <div className="flex items-center gap-1 font-semibold text-sky-600">
                        <Clock className="w-4 h-4" />
                        {appt.timeSlot}
                      </div>
                    </td>
                    {/* Status */}
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
                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {appt.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(appt.id, 'ACCEPTED')}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-250 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                              title="Accept Appointment"
                            >
                              <Check className="w-4.5 h-4.5" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(appt.id, 'REJECTED')}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-250 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                              title="Reject Appointment"
                            >
                              <X className="w-4.5 h-4.5" />
                              Reject
                            </button>
                          </>
                        )}
                        {appt.status === 'ACCEPTED' && (
                          <button
                            onClick={() => openPrescriptionModal(appt.id)}
                            className="px-3 py-1.5 bg-gradient-to-r from-sky-500 to-primary-600 text-white rounded-lg text-xs font-bold shadow-md shadow-sky-500/10 hover:shadow-lg active:scale-95 transition-all flex items-center gap-1"
                          >
                            <FileText className="w-4 h-4" />
                            Prescribe & Complete
                          </button>
                        )}
                        {appt.status === 'COMPLETED' && appt.prescription && (
                          <div className="text-xs text-slate-500 max-w-[150px] truncate text-left">
                            <span className="font-bold flex items-center gap-1 text-slate-700">
                              <Pill className="w-3.5 h-3.5 text-sky-500" />
                              {appt.prescription.medicineDetails}
                            </span>
                            <span className="text-[10px] text-slate-450 italic">{appt.prescription.notes}</span>
                          </div>
                        )}
                        {appt.status === 'CANCELLED' && (
                          <span className="text-xs text-slate-400 italic">Cancelled by patient</span>
                        )}
                        {appt.status === 'REJECTED' && (
                          <span className="text-xs text-slate-400 italic">Rejected by you</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PRESCRIPTION FORM MODAL */}
      {prescribingApptId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 animate-slide-in">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg">Add Prescription Notes</h3>
                <p className="text-xs text-slate-400 mt-0.5">Write medicine details to complete this visit</p>
              </div>
              <button
                onClick={closePrescriptionModal}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handlePrescribeSubmit} className="p-6 space-y-4">
              {/* Medicine details */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Medicines & Dosages <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={medicineDetails}
                  onChange={(e) => setMedicineDetails(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all resize-none"
                  placeholder="Amoxicillin 500mg - 3 times daily for 7 days&#10;Paracetamol 650mg - as needed for pain..."
                  required
                />
              </div>

              {/* General notes */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Dietary / Lifestyle Advice Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all resize-none"
                  placeholder="Take after food. Drink plenty of water and rest..."
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closePrescriptionModal}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPrescription}
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-75 flex items-center gap-1.5"
                >
                  {submittingPrescription && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Submit & Complete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointmentsToday;
