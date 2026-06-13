import api from './api';

const adminService = {
  // Doctor Management
  addDoctor: async (doctorData) => {
    const response = await api.post('/api/admin/doctors', doctorData);
    return response.data;
  },
  
  updateDoctor: async (id, doctorData) => {
    const response = await api.put(`/api/admin/doctors/${id}`, doctorData);
    return response.data;
  },

  deleteDoctor: async (id) => {
    const response = await api.delete(`/api/admin/doctors/${id}`);
    return response.data;
  },

  getDoctorById: async (id) => {
    const response = await api.get(`/api/admin/doctors/${id}`);
    return response.data;
  },

  getAllDoctors: async () => {
    const response = await api.get('/api/admin/doctors');
    return response.data;
  },

  // Patients Management
  getAllPatients: async () => {
    const response = await api.get('/api/admin/patients');
    return response.data;
  },

  // Appointments Management
  getAllAppointments: async () => {
    const response = await api.get('/api/admin/appointments');
    return response.data;
  },

  // Department Management
  addDepartment: async (deptData) => {
    const response = await api.post('/api/admin/departments', deptData);
    return response.data;
  },

  getAllDepartments: async () => {
    const response = await api.get('/api/admin/departments');
    return response.data;
  },

  // Salary Management
  paySalary: async (salaryData) => {
    const response = await api.post('/api/admin/salaries', salaryData);
    return response.data;
  },

  getSalaryHistory: async (doctorId) => {
    const response = await api.get(`/api/admin/doctors/${doctorId}/salaries`);
    return response.data;
  },

  // Dashboard Metrics
  getDashboardStats: async () => {
    const response = await api.get('/api/admin/dashboard/stats');
    return response.data;
  }
};

export default adminService;
