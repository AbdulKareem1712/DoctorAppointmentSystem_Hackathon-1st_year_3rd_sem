import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import patientService from '../../services/patientService';
import { useToast } from '../../context/ToastContext';
import { Search, Stethoscope, Building2, Calendar, Loader2, ArrowRight } from 'lucide-react';

const PatientDoctors = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDoctors = async () => {
    try {
      const data = await patientService.getAllDoctors();
      setDoctors(data);
    } catch (err) {
      addToast('Failed to load doctor directory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [addToast]);

  const filteredDoctors = doctors.filter((doc) => {
    const query = searchQuery.toLowerCase();
    return (
      doc.name.toLowerCase().includes(query) ||
      doc.specialization.toLowerCase().includes(query) ||
      (doc.departmentName && doc.departmentName.toLowerCase().includes(query))
    );
  });

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
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Our Specialists</h2>
          <p className="text-slate-400 text-sm mt-1">Browse directories and book diagnostic consultations</p>
        </div>
        
        {/* Search Input */}
        <div className="relative max-w-sm w-full">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Search className="w-4.5 h-4.5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            placeholder="Search specialization, department or doctor..."
          />
        </div>
      </div>

      {/* Grid of Doctor Cards */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-slate-400">
          No medical specialists match your search criteria.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200 hover:scale-[1.01]"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-750 flex items-center justify-center font-extrabold text-lg border border-sky-100">
                    {doc.name.replace('Dr. ', '').charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-base">{doc.name}</h4>
                    <span className="text-[10px] uppercase font-bold text-sky-500 tracking-wider flex items-center gap-1 mt-0.5">
                      <Stethoscope className="w-3.5 h-3.5" />
                      {doc.specialization}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-450" />
                    <span>Clinic: {doc.departmentName || 'General Practice'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-450" />
                    <span>Mon - Fri Schedule</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => navigate('/patient/book', { state: { doctorId: doc.id } })}
                  className="w-full py-2.5 bg-slate-50 hover:bg-sky-500 hover:text-white border border-slate-200 hover:border-sky-400 rounded-xl text-xs font-bold text-sky-600 shadow-sm flex items-center justify-center gap-1.5 transition-all group"
                >
                  Book Appointment
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientDoctors;
