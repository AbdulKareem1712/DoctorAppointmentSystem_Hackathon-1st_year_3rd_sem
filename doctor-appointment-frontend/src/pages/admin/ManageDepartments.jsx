import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Building2, Plus, Loader2 } from 'lucide-react';

const ManageDepartments = () => {
  const { addToast } = useToast();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDepartments = async () => {
    try {
      const data = await adminService.getAllDepartments();
      setDepartments(data);
    } catch (err) {
      addToast('Failed to fetch departments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [addToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Department name is required', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const newDept = await adminService.addDepartment({ name, description });
      addToast(`Department '${newDept.name}' created successfully!`, 'success');
      setDepartments((prev) => [...prev, newDept]);
      setName('');
      setDescription('');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to create department';
      addToast(errMsg, 'error');
    } finally {
      setSubmitting(false);
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
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Departments</h2>
        <p className="text-slate-400 text-sm mt-1">Define medical branches and clinical specialties</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        
        {/* ADD DEPARTMENT FORM */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-800 text-md">Add Department</h3>
            <p className="text-xs text-slate-400 mt-0.5">Register a new clinic subdivision</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Department Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                placeholder="Ophthalmology"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all resize-none"
                placeholder="Eye care, surgeries, and vision treatments..."
              />
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
                  Add Department
                </>
              )}
            </button>
          </form>
        </div>

        {/* LIST DEPARTMENTS TABLE */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden md:col-span-2">
          {departments.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No departments defined yet. Please create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/3">Department</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {departments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        <div className="flex items-center gap-2.5">
                          <Building2 className="w-4 h-4 text-sky-500" />
                          {dept.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 leading-relaxed">
                        {dept.description || 'No description provided.'}
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
  );
};

export default ManageDepartments;
