import api from './api';

const reportService = {
  getAdminReport: async () => {
    const response = await api.get('/api/admin/reports');
    return response.data;
  },

  getDoctorReport: async () => {
    const response = await api.get('/api/doctor/reports');
    return response.data;
  },

  getPatientReport: async () => {
    const response = await api.get('/api/patient/reports');
    return response.data;
  }
};

export default reportService;
