import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AddDoctor from '../pages/admin/AddDoctor';
import ManageDoctors from '../pages/admin/ManageDoctors';
import ManageDepartments from '../pages/admin/ManageDepartments';
import ManageAppointments from '../pages/admin/ManageAppointments';
import ManagePatients from '../pages/admin/ManagePatients';
import ManageSalaries from '../pages/admin/ManageSalaries';
import AdminReports from '../pages/admin/AdminReports';

// Doctor Pages
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import DoctorAppointmentsToday from '../pages/doctor/DoctorAppointmentsToday';
import DoctorAppointmentsUpcoming from '../pages/doctor/DoctorAppointmentsUpcoming';
import DoctorSchedule from '../pages/doctor/DoctorSchedule';
import DoctorPrescriptions from '../pages/doctor/DoctorPrescriptions';
import DoctorReports from '../pages/doctor/DoctorReports';

// Patient Pages
import PatientDashboard from '../pages/patient/PatientDashboard';
import PatientDoctors from '../pages/patient/PatientDoctors';
import PatientBookAppointment from '../pages/patient/PatientBookAppointment';
import PatientHistory from '../pages/patient/PatientHistory';
import PatientReports from '../pages/patient/PatientReports';

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC AUTH ROUTES */}
      <Route
        path="/login"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />
      <Route
        path="/register"
        element={
          <AuthLayout>
            <Register />
          </AuthLayout>
        }
      />

      {/* ADMIN CONTROL ROUTES */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="add-doctor" element={<AddDoctor />} />
                <Route path="doctors" element={<ManageDoctors />} />
                <Route path="departments" element={<ManageDepartments />} />
                <Route path="appointments" element={<ManageAppointments />} />
                <Route path="patients" element={<ManagePatients />} />
                <Route path="salaries" element={<ManageSalaries />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* DOCTOR CONTROL ROUTES */}
      <Route
        path="/doctor/*"
        element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DashboardLayout>
              <Routes>
                <Route path="dashboard" element={<DoctorDashboard />} />
                <Route path="appointments/today" element={<DoctorAppointmentsToday />} />
                <Route path="appointments/upcoming" element={<DoctorAppointmentsUpcoming />} />
                <Route path="schedule" element={<DoctorSchedule />} />
                <Route path="prescriptions" element={<DoctorPrescriptions />} />
                <Route path="reports" element={<DoctorReports />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* PATIENT CONTROL ROUTES */}
      <Route
        path="/patient/*"
        element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <DashboardLayout>
              <Routes>
                <Route path="dashboard" element={<PatientDashboard />} />
                <Route path="doctors" element={<PatientDoctors />} />
                <Route path="book" element={<PatientBookAppointment />} />
                <Route path="history" element={<PatientHistory />} />
                <Route path="reports" element={<PatientReports />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* DEFAULT ROUTE REDIRECTS */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
