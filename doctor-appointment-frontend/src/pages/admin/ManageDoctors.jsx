import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Edit2, Trash2, UserPlus, X, Stethoscope, DollarSign, Mail, Phone, Loader2 } from 'lucide-react';

const ManageDoctors = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Editing States
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editDepartmentId, setEditDepartmentId] = useState('');
  const [editSpecialization, setEditSpecialization] = useState('');
  const [editSalary, setEditSalary] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchDoctorsAndDepartments = async () => {
    try {
      const doctorsData = await adminService.getAllDoctors();
      setDoctors(doctorsData);

      const deptsData = await adminService.getAllDepartments();
      setDepartments(deptsData);
    } catch (err) {
      addToast('Failed to fetch doctor listing', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorsAndDepartments();
  }, [addToast]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor? This will remove all schedules and profile details.')) {
      return;
    }

    try {
      await adminService.deleteDoctor(id);
      addToast('Doctor profile removed successfully', 'success');
      setDoctors((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      addToast('Failed to delete doctor account', 'error');
    }
  };

  const openEditModal = (doc) => {
    setEditingDoctor(doc);
    setEditName(doc.name);
    setEditEmail(doc.email);
    setEditPhone(doc.phone || '');
    setEditDepartmentId(doc.departmentId || '');
    setEditSpecialization(doc.specialization);
    setEditSalary(doc.salary || '');
  };

  const closeEditModal = () => {
    setEditingDoctor(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const updated = await adminService.updateDoctor(editingDoctor.id, {
        name: editName,
        email: editEmail,
        phone: editPhone,
        departmentId: Number(editDepartmentId),
        specialization: editSpecialization,
        salary: Number(editSalary)
      });
      addToast('Doctor details updated successfully', 'success');
      
      // Update local state
      setDoctors((prev) =>
        prev.map((d) => (d.id === editingDoctor.id ? { ...d, ...updated } : d))
      );
      closeEditModal();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update doctor details';
      addToast(errMsg, 'error');
    } finally {
      setUpdating(false);
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Manage Doctors</h2>
          <p className="text-slate-400 text-sm mt-1">Review profiles, edit settings, or terminate accounts</p>
        </div>
        <button
          onClick={() => navigate('/admin/add-doctor')}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-sky-500 to-primary-600 text-white font-semibold text-sm rounded-xl hover:shadow-lg hover:shadow-sky-500/10 active:scale-[0.98] transition-all"
        >
          <UserPlus className="w-4 h-4" />
          Add Doctor
        </button>
      </div>

      {/* Grid of Doctors */}
      {doctors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
          No doctor profiles registered. Please add a doctor.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Specialization</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Base Salary</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {doctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-sky-50 border border-sky-100 text-sky-700 flex items-center justify-center font-bold">
                          {doc.name.replace('Dr. ', '').charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-850">{doc.name}</p>
                          <p className="text-xs text-slate-400">{doc.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {doc.departmentName || 'General'}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{doc.specialization}</td>
                    <td className="px-6 py-4 text-slate-800 font-semibold">
                      ${(doc.salary ?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{doc.phone || 'N/A'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(doc)}
                          className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                          title="Edit Profile"
                        >
                          <Edit2 className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete Doctor"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-100 animate-slide-in">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg">Edit Doctor Profile</h3>
                <p className="text-xs text-slate-400 mt-0.5">Modify parameters for Dr. {editingDoctor.name}</p>
              </div>
              <button
                onClick={closeEditModal}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Doctor Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Phone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Department</label>
                  <select
                    value={editDepartmentId}
                    onChange={(e) => setEditDepartmentId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    required
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Specialization</label>
                  <input
                    type="text"
                    value={editSpecialization}
                    onChange={(e) => setEditSpecialization(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    required
                  />
                </div>

                {/* Salary */}
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Salary ($)</label>
                  <input
                    type="number"
                    value={editSalary}
                    onChange={(e) => setEditSalary(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-75 flex items-center gap-1.5"
                >
                  {updating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
