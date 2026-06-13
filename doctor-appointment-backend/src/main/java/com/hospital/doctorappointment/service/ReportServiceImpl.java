package com.hospital.doctorappointment.service;

import com.hospital.doctorappointment.dto.ReportDTO;
import com.hospital.doctorappointment.entity.*;
import com.hospital.doctorappointment.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final SalaryRepository salaryRepository;
    private final DepartmentRepository departmentRepository;
    private final PrescriptionRepository prescriptionRepository;

    @Override
    public ReportDTO.AdminReportDTO getAdminReport() {
        long totalDoctors = doctorRepository.count();
        long totalPatients = userRepository.countByRole(Role.PATIENT);
        long totalAppointments = appointmentRepository.count();

        LocalDate startOfWeek = LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endOfWeek = LocalDate.now().with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
        
        long appointmentsThisWeek = appointmentRepository.findByAppointmentDateBetween(startOfWeek, endOfWeek).size();
        
        long completedAppointments = appointmentRepository.findByStatus(AppointmentStatus.COMPLETED).size();
        long cancelledAppointments = appointmentRepository.findByStatus(AppointmentStatus.CANCELLED).size();

        // Count doctors created recently (e.g. this month, simplified as total doctors)
        long newDoctorsAdded = totalDoctors;

        List<Doctor> allDoctors = doctorRepository.findAll();
        Map<String, Long> deptStats = new HashMap<>();
        for (Doctor d : allDoctors) {
            if (d.getDepartment() != null) {
                String deptName = d.getDepartment().getName();
                deptStats.put(deptName, deptStats.getOrDefault(deptName, 0L) + 1);
            }
        }

        Map<String, Long> docStats = new HashMap<>();
        List<Appointment> completed = appointmentRepository.findByStatus(AppointmentStatus.COMPLETED);
        for (Appointment a : completed) {
            String docName = a.getDoctor().getUser().getName();
            docStats.put(docName, docStats.getOrDefault(docName, 0L) + 1);
        }

        List<Salary> allSalaries = salaryRepository.findAll();
        double salarySummary = allSalaries.stream()
                .mapToDouble(s -> s.getBaseSalary() + (s.getBonus() != null ? s.getBonus() : 0))
                .sum();

        return ReportDTO.AdminReportDTO.builder()
                .totalDoctors(totalDoctors)
                .totalPatients(totalPatients)
                .totalAppointments(totalAppointments)
                .appointmentsThisWeek(appointmentsThisWeek)
                .completedAppointments(completedAppointments)
                .cancelledAppointments(cancelledAppointments)
                .newDoctorsAdded(newDoctorsAdded)
                .departmentWiseStatistics(deptStats)
                .doctorPerformanceStatistics(docStats)
                .salarySummary(salarySummary)
                .build();
    }

    @Override
    public ReportDTO.DoctorReportDTO getDoctorReport(Long doctorUserId) {
        Doctor doctor = doctorRepository.findByUserId(doctorUserId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        Long docId = doctor.getId();

        LocalDate today = LocalDate.now();
        List<Appointment> todayApps = appointmentRepository.findByDoctorIdAndAppointmentDate(docId, today);
        long patientsTreatedToday = todayApps.stream().filter(a -> a.getStatus() == AppointmentStatus.COMPLETED).count();

        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endOfWeek = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
        List<Appointment> weekApps = appointmentRepository.findByDoctorIdAndAppointmentDateBetween(docId, startOfWeek, endOfWeek);
        long patientsTreatedThisWeek = weekApps.stream().filter(a -> a.getStatus() == AppointmentStatus.COMPLETED).count();

        List<Appointment> allApps = appointmentRepository.findByDoctorId(docId);
        long completedAppointments = allApps.stream().filter(a -> a.getStatus() == AppointmentStatus.COMPLETED).count();
        long cancelledAppointments = allApps.stream().filter(a -> a.getStatus() == AppointmentStatus.CANCELLED).count();
        
        long upcomingAppointments = allApps.stream()
                .filter(a -> a.getAppointmentDate().isAfter(today) || (a.getAppointmentDate().isEqual(today) && a.getStatus() == AppointmentStatus.ACCEPTED))
                .count();

        return ReportDTO.DoctorReportDTO.builder()
                .patientsTreatedToday(patientsTreatedToday)
                .patientsTreatedThisWeek(patientsTreatedThisWeek)
                .completedAppointments(completedAppointments)
                .cancelledAppointments(cancelledAppointments)
                .upcomingAppointments(upcomingAppointments)
                .build();
    }

    @Override
    public ReportDTO.PatientReportDTO getPatientReport(Long patientUserId) {
        List<Appointment> allApps = appointmentRepository.findByPatientId(patientUserId);
        
        long totalAppointments = allApps.size();
        long completedAppointments = allApps.stream().filter(a -> a.getStatus() == AppointmentStatus.COMPLETED).count();
        long cancelledAppointments = allApps.stream().filter(a -> a.getStatus() == AppointmentStatus.CANCELLED).count();
        
        long doctorsConsulted = allApps.stream().map(a -> a.getDoctor().getId()).distinct().count();

        List<ReportDTO.AppointmentDetails> history = allApps.stream().map(a -> 
            ReportDTO.AppointmentDetails.builder()
                .date(a.getAppointmentDate().toString())
                .timeSlot(a.getTimeSlot())
                .doctorName(a.getDoctor().getUser().getName())
                .department(a.getDoctor().getDepartment() != null ? a.getDoctor().getDepartment().getName() : "N/A")
                .status(a.getStatus().name())
                .build()
        ).collect(Collectors.toList());

        List<Prescription> prescriptions = prescriptionRepository.findByAppointmentPatientId(patientUserId);
        List<ReportDTO.PrescriptionDetails> rxHistory = prescriptions.stream().map(p -> 
            ReportDTO.PrescriptionDetails.builder()
                .date(p.getAppointment().getAppointmentDate().toString())
                .doctorName(p.getAppointment().getDoctor().getUser().getName())
                .medicineDetails(p.getMedicineDetails())
                .notes(p.getNotes())
                .build()
        ).collect(Collectors.toList());

        return ReportDTO.PatientReportDTO.builder()
                .totalAppointments(totalAppointments)
                .completedAppointments(completedAppointments)
                .cancelledAppointments(cancelledAppointments)
                .doctorsConsulted(doctorsConsulted)
                .appointmentHistory(history)
                .prescriptionHistory(rxHistory)
                .build();
    }
}
