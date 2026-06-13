import React, { useState, useEffect } from 'react';
import doctorService from '../../services/doctorService';
import { useToast } from '../../context/ToastContext';
import { Pill, Calendar, Heart, FileText, Loader2 } from 'lucide-react';

const DoctorPrescriptions = () => {
  const { addToast } = useToast();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        // Fetch today's appointments (which could be completed)
        const today = await doctorService.getTodayAppointments();
        
        // Filter appointments with status COMPLETED and having a prescription
        const completedToday = today.filter(
          (a) => a.status === 'COMPLETED' && a.prescription
        );
        
        setPrescriptions(completedToday);
      } catch (err) {
        addToast('Failed to fetch prescription listing', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
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
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Prescriptions</h2>
        <p className="text-slate-400 text-sm mt-1">Review clinical prescription logs logged today</p>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {prescriptions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No completed prescriptions logged in the system today.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Medicines Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Clinical Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {prescriptions.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-rose-500" />
                        {appt.patientName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-650">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-4 h-4 text-sky-500" />
                        {appt.appointmentDate}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 ml-5.5">{appt.timeSlot}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold flex items-center gap-1.5 text-slate-850">
                        <Pill className="w-4 h-4 text-sky-500" />
                        {appt.prescription.medicineDetails}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 italic max-w-xs truncate">
                      {appt.prescription.notes || 'No extra advice.'}
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

export default DoctorPrescriptions;
