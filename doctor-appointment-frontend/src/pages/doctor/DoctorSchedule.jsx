import React, { useState, useEffect } from 'react';
import doctorService from '../../services/doctorService';
import { useToast } from '../../context/ToastContext';
import { Clock, Calendar, Plus, Check, Loader2 } from 'lucide-react';

const DoctorSchedule = () => {
  const { addToast } = useToast();
  
  const [scheduleList, setScheduleList] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  // Form states
  const [date, setDate] = useState('');
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Pre-defined standard time slots
  const standardSlots = [
    '09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00',
    '11:00-11:30', '11:30-12:00', '14:00-14:30', '14:30-15:00',
    '15:00-15:30', '15:30-16:00', '16:00-16:30', '16:30-17:00'
  ];

  const fetchOwnSchedule = async () => {
    try {
      const data = await doctorService.getOwnSchedule();
      setScheduleList(data.reverse()); // Show newest slots first
    } catch (err) {
      addToast('Failed to load availability slots', 'error');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchOwnSchedule();
  }, [addToast]);

  const handleCheckboxChange = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots((prev) => prev.filter((s) => s !== slot));
    } else {
      setSelectedSlots((prev) => [...prev, slot]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) {
      addToast('Please select a date', 'warning');
      return;
    }
    if (selectedSlots.length === 0) {
      addToast('Please select at least one time slot', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const results = await doctorService.setAvailability({
        date,
        timeSlots: selectedSlots
      });
      addToast('Availability slots registered successfully!', 'success');
      
      // Update schedule list with new results (avoiding duplicates locally)
      setScheduleList((prev) => {
        const filtered = prev.filter(
          (item) =>
            !(item.date === date && selectedSlots.includes(item.timeSlot))
        );
        return [...results.reverse(), ...filtered];
      });

      setSelectedSlots([]);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to register schedule slots';
      addToast(errMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Abdul kareem 2500030144
  return (
    <div className="space-y-8 animate-slide-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Availability Scheduler</h2>
        <p className="text-slate-400 text-sm mt-1">Set the timeslots you are available to receive patient bookings</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        
        {/* SET AVAILABILITY FORM */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-800 text-md">Define Slots</h3>
            <p className="text-xs text-slate-400 mt-0.5">Select a date and checking available times</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]} // Cannot schedule past dates
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                required
              />
            </div>

            {/* Slots Grid Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Available Time Slots
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                {standardSlots.map((slot) => {
                  const isChecked = selectedSlots.includes(slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => handleCheckboxChange(slot)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-sky-50 text-sky-600 border-sky-300 font-bold'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-350'
                      }`}
                    >
                      <span>{slot}</span>
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-primary-600 text-white font-semibold text-sm rounded-xl hover:shadow-lg hover:shadow-sky-500/10 active:scale-[0.98] transition-all disabled:opacity-75 flex items-center justify-center gap-1.5"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Save Availability
                </>
              )}
            </button>
          </form>
        </div>

        {/* LIST LOGS TABLE */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden md:col-span-2 min-h-[300px] flex flex-col justify-between">
          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-800">Your Availability Calendar</h3>
            <p className="text-xs text-slate-400 mt-0.5">Summary of all registered slots and their statuses</p>
          </div>

          <div className="flex-1">
            {loadingList ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
              </div>
            ) : scheduleList.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm h-48 flex items-center justify-center">
                No slots configured yet. Please use the form to schedule availability.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time Slot</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Availability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-750">
                    {scheduleList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {item.date}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          <span className="flex items-center gap-1 text-slate-650">
                            <Clock className="w-4 h-4 text-sky-500/80" />
                            {item.timeSlot}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                            item.isAvailable
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}>
                            {item.isAvailable ? 'Free / Open' : 'Booked'}
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

      </div>
    </div>
  );
};

export default DoctorSchedule;
