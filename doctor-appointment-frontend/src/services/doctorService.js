import api from './api';

const doctorService = {
  getTodayAppointments: async () => {
    const response = await api.get('/api/doctor/appointments/today');
    return response.data;
  },

  getUpcomingAppointments: async () => {
    const response = await api.get('/api/doctor/appointments/upcoming');
    return response.data;
  },

  updateAppointmentStatus: async (appointmentId, status) => {
    const response = await api.put(`/api/doctor/appointments/${appointmentId}/status`, null, {
      params: { status }
    });
    return response.data;
  },

  completeAppointment: async (appointmentId, prescriptionData) => {
    const response = await api.post(`/api/doctor/appointments/${appointmentId}/complete`, prescriptionData);
    return response.data;
  },

  setAvailability: async (scheduleData) => {
    const response = await api.post('/api/doctor/schedule', scheduleData);
    return response.data;
  },

  getOwnSchedule: async () => {
    const response = await api.get('/api/doctor/schedule');
    return response.data;
  }
};

export default doctorService;
