package com.hospital.doctorappointment.service;

import com.hospital.doctorappointment.dto.DashboardStatsResponse;
import com.hospital.doctorappointment.entity.Role;
import com.hospital.doctorappointment.entity.Salary;
import com.hospital.doctorappointment.repository.AppointmentRepository;
import com.hospital.doctorappointment.repository.DoctorRepository;
import com.hospital.doctorappointment.repository.SalaryRepository;
import com.hospital.doctorappointment.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AdminDashboardService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final SalaryRepository salaryRepository;

    public AdminDashboardService(DoctorRepository doctorRepository,
                                 UserRepository userRepository,
                                 AppointmentRepository appointmentRepository,
                                 SalaryRepository salaryRepository) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
        this.salaryRepository = salaryRepository;
    }

    public DashboardStatsResponse getDashboardStats() {
        long totalDoctors = doctorRepository.count();
        long totalPatients = userRepository.countByRole(Role.PATIENT);
        long totalAppointments = appointmentRepository.count();
        long appointmentsToday = appointmentRepository.countByAppointmentDate(LocalDate.now());

        // Calculate total salaries paid
        double totalSalariesPaid = salaryRepository.findAll().stream()
                .mapToDouble(s -> s.getBaseSalary() + (s.getBonus() != null ? s.getBonus() : 0.0))
                .sum();

        return DashboardStatsResponse.builder()
                .totalDoctors(totalDoctors)
                .totalPatients(totalPatients)
                .totalAppointments(totalAppointments)
                .appointmentsToday(appointmentsToday)
                .totalSalariesPaid(totalSalariesPaid)
                .build();
    }
}
