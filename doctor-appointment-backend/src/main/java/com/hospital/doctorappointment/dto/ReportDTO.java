package com.hospital.doctorappointment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

public class ReportDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminReportDTO {
        private long totalDoctors;
        private long totalPatients;
        private long totalAppointments;
        private long appointmentsThisWeek;
        private long completedAppointments;
        private long cancelledAppointments;
        private long newDoctorsAdded; // Could just be total doctors if no date is tracked, or we use doctors from last week
        private Map<String, Long> departmentWiseStatistics;
        private Map<String, Long> doctorPerformanceStatistics; // e.g., Doctor Name -> Completed Appointments
        private Double salarySummary; // Sum of all salaries
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DoctorReportDTO {
        private long patientsTreatedToday;
        private long patientsTreatedThisWeek;
        private long completedAppointments;
        private long cancelledAppointments;
        private long upcomingAppointments;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PatientReportDTO {
        private long totalAppointments;
        private long completedAppointments;
        private long cancelledAppointments;
        private long doctorsConsulted;
        private List<AppointmentDetails> appointmentHistory;
        private List<PrescriptionDetails> prescriptionHistory;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AppointmentDetails {
        private String date;
        private String timeSlot;
        private String doctorName;
        private String department;
        private String status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrescriptionDetails {
        private String date;
        private String doctorName;
        private String medicineDetails;
        private String notes;
    }
}
