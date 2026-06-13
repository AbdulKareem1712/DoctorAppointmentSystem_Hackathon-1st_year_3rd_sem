import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { DollarSign, Plus, Loader2, Calendar } from 'lucide-react';

const ManageSalaries = () => {
  const { addToast } = useToast();
  const [doctors, setDoctors] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  // Selector
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Form states
  const [baseSalary, setBaseSalary] = useState('');
  const [bonus, setBonus] = useState('0');
  const [paymentStatus, setPaymentStatus] = useState('PAID');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await adminService.getAllDoctors();
        setDoctors(data);
        if (data.length > 0) {
          setSelectedDoctorId(data[0].id);
          setBaseSalary(data[0].salary || '');
        }
      } catch (err) {
        addToast('Failed to load doctors list', 'error');
      } finally {
        setLoadingDocs(false);
      }
    };
    fetchDoctors();
  }, [addToast]);

  // Fetch history when selected doctor changes
  useEffect(() => {
    if (!selectedDoctorId) return;

    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const history = await adminService.getSalaryHistory(selectedDoctorId);
        setSalaryHistory(history);
      } catch (err) {
        addToast('Failed to load salary logs', 'error');
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();

    // Prefill base salary from selected doctor profile
    const selectedDoc = doctors.find((d) => d.id === Number(selectedDoctorId));
    if (selectedDoc) {
      setBaseSalary(selectedDoc.salary || '');
    }
  }, [selectedDoctorId, doctors, addToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId || !baseSalary) {
      addToast('Please fill in all required fields', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const result = await adminService.paySalary({
        doctorId: Number(selectedDoctorId),
        baseSalary: Number(baseSalary),
        bonus: Number(bonus),
        paymentStatus
      });
      addToast('Salary transaction processed successfully!', 'success');
      
      // Update history in view
      setSalaryHistory((prev) => [result, ...prev]);
      setBonus('0');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to submit salary payment';
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
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Staff Salaries</h2>
        <p className="text-slate-400 text-sm mt-1">Audit pay stubs and issue monthly doctor payouts</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        
        {/* PAY SALARY FORM */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-800 text-md">Issue Payout</h3>
            <p className="text-xs text-slate-400 mt-0.5">Log a monthly salary disbursement</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Select Doctor */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Select Staff Doctor
              </label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                required
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.specialization})
                  </option>
                ))}
              </select>
            </div>

            {/* Base Salary */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Base Salary ($)
              </label>
              <input
                type="number"
                value={baseSalary}
                onChange={(e) => setBaseSalary(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                min="0"
                required
              />
            </div>

            {/* Bonus */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Add-on Bonus ($)
              </label>
              <input
                type="number"
                value={bonus}
                onChange={(e) => setBonus(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                min="0"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
              >
                <option value="PAID">PAID</option>
                <option value="PENDING">PENDING</option>
              </select>
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
                  Process Payment
                </>
              )}
            </button>
          </form>
        </div>

        {/* LOG HISTORY */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden md:col-span-2 min-h-[300px] flex flex-col justify-between">
          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-800">Payout Logs</h3>
            <p className="text-xs text-slate-400 mt-0.5">Historical payouts issued for selected doctor</p>
          </div>

          <div className="flex-1">
            {loadingHistory ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
              </div>
            ) : salaryHistory.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm h-48 flex items-center justify-center">
                No salary transactions logged for this doctor yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Base Salary</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Bonus</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Payout</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {salaryHistory.map((stub) => (
                      <tr key={stub.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-700 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {stub.paymentDate}
                        </td>
                        <td className="px-6 py-4 text-slate-650">${(stub.baseSalary ?? 0).toLocaleString()}</td>
                        <td className="px-6 py-4 text-emerald-600 font-semibold">+${(stub.bonus ?? 0).toLocaleString()}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">
                          ${((stub.baseSalary ?? 0) + (stub.bonus ?? 0)).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                            stub.paymentStatus === 'PAID'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : 'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}>
                            {stub.paymentStatus}
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

export default ManageSalaries;
