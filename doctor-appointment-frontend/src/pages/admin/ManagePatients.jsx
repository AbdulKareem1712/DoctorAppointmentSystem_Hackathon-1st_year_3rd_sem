import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { HeartPulse, Loader2 } from 'lucide-react';

const ManagePatients = () => {
  const { addToast } = useToast();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await adminService.getAllPatients();
        setPatients(data);
      } catch (err) {
        addToast('Failed to fetch patient accounts list', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
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
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Registered Patients</h2>
        <p className="text-slate-400 text-sm mt-1">Review profiles of hospital clinical clients</p>
      </div>

      {/* Patients Grid/Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {patients.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No patients registered in the database yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">System Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-750">
                {patients.map((pat) => (
                  <tr key={pat.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-850">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                          {pat.name.charAt(0)}
                        </div>
                        {pat.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{pat.email}</td>
                    <td className="px-6 py-4 text-slate-500">{pat.phone || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full font-bold text-[10px] uppercase">
                        {pat.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">#CF-P-{pat.id}</td>
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

export default ManagePatients;
