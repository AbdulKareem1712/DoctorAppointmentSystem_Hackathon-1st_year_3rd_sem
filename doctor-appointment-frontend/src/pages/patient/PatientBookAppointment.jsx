import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import patientService from '../../services/patientService';
import { useToast } from '../../context/ToastContext';
import { Calendar, User, Clock, Check, Loader2 } from 'lucide-react';

const PatientBookAppointment = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [doctors, setDoctors] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  // Form states
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await patientService.getAllDoctors();
        setDoctors(data);

        // Preselect doctor if passed from Doctor Directory route state
        if (location.state?.doctorId) {
          setDoctorId(location.state.doctorId.toString());
        } else if (data.length > 0) {
          setDoctorId(data[0].id.toString());
        }
      } catch (err) {
        addToast('Failed to load doctor database directory', 'error');
      } finally {
        setLoadingDocs(false);
      }
    };
    fetchDoctors();
  }, [location, addToast]);

  // Fetch available slots when doctor or date changes
  useEffect(() => {
    if (!doctorId || !date) {
      setAvailableSlots([]);
      setSelectedSlot('');
      return;
    }

    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const slots = await patientService.getAvailableSlots(Number(doctorId), date);
        setAvailableSlots(slots);
        setSelectedSlot('');
      } catch (err) {
        addToast('Failed to retrieve availability slots', 'error');
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [doctorId, date, addToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId || !date || !selectedSlot) {
      addToast('Please complete all form inputs', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await patientService.bookAppointment({
        doctorId: Number(doctorId),
        appointmentDate: date,
        timeSlot: selectedSlot
      });
      addToast('Consultation request submitted! Awaiting review.', 'success');
      navigate('/patient/history');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to finalize booking request';
      addToast(errMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDocs) {
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
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Book Consultation</h2>
        <p className="text-slate-400 text-sm mt-1">Schedule a clinical session with a specialist doctor</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Select Doctor */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Specialist Doctor
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <User className="w-5 h-5" />
              </span>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all appearance-none"
                required
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.specialization})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Select Date */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Target Date
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Calendar className="w-5 h-5" />
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]} // Block historical dates
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Select Available Slots */}
          {doctorId && date && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Available Hours
              </label>

              {loadingSlots ? (
                <div className="flex gap-2 items-center text-xs text-slate-400 py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
                  Checking calendar availability...
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-sm text-slate-400 italic py-4">
                  Doctor has no available slots scheduled on this date.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlot === slot.timeSlot;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlot(slot.timeSlot)}
                        className={`py-3 px-4 text-xs font-semibold rounded-xl border flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-sky-50 text-sky-600 border-sky-300 font-extrabold'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-350'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 opacity-70" />
                          {slot.timeSlot}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !selectedSlot}
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-primary-600 text-white font-semibold text-sm rounded-xl hover:shadow-lg hover:shadow-sky-500/10 focus:outline-none active:scale-[0.98] transition-all disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Confirming booking details...
              </>
            ) : (
              'Confirm Appointment Booking'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientBookAppointment;
