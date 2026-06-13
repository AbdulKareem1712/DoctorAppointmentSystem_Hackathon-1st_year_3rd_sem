import api from './api';

const patientService = {
  getAllDoctors: async () => {
    const response = await api.get('/api/patient/doctors');
    return response.data;
  },

  searchDoctors: async (specialization) => {
    const response = await api.get('/api/patient/doctors/search', {
      params: { specialization }
    });
    return response.data;
  },

  getAvailableSlots: async (doctorId, date) => {
    const response = await api.get(`/api/patient/doctors/${doctorId}/schedule`, {
      params: { date }
    });
    return response.data;
  },

  bookAppointment: async (appointmentData) => {
    const response = await api.post('/api/patient/appointments/book', appointmentData);
    return response.data;
  },

  cancelAppointment: async (appointmentId) => {
    const response = await api.put(`/api/patient/appointments/${appointmentId}/cancel`);
    return response.data;
  },

  getAppointmentHistory: async () => {
    const response = await api.get('/api/patient/appointments/history');
    return response.data;
  }
};

export default patientService;
