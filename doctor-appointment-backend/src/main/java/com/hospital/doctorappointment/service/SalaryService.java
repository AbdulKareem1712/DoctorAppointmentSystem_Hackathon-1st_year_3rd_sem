package com.hospital.doctorappointment.service;

import com.hospital.doctorappointment.dto.SalaryRequest;
import com.hospital.doctorappointment.dto.SalaryResponse;
import com.hospital.doctorappointment.entity.Doctor;
import com.hospital.doctorappointment.entity.Salary;
import com.hospital.doctorappointment.exception.ResourceNotFoundException;
import com.hospital.doctorappointment.repository.DoctorRepository;
import com.hospital.doctorappointment.repository.SalaryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SalaryService {

    private final SalaryRepository salaryRepository;
    private final DoctorRepository doctorRepository;

    public SalaryService(SalaryRepository salaryRepository, DoctorRepository doctorRepository) {
        this.salaryRepository = salaryRepository;
        this.doctorRepository = doctorRepository;
    }

    @Transactional
    public SalaryResponse paySalary(SalaryRequest request) {
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + request.getDoctorId()));

        // Log salary payment record
        Salary salary = Salary.builder()
                .doctor(doctor)
                .baseSalary(request.getBaseSalary())
                .bonus(request.getBonus() != null ? request.getBonus() : 0.0)
                .paymentDate(LocalDate.now())
                .paymentStatus(request.getPaymentStatus())
                .build();

        Salary savedSalary = salaryRepository.save(salary);

        // Update Doctor's current salary cache
        doctor.setSalary(request.getBaseSalary());
        doctorRepository.save(doctor);

        return mapToResponse(savedSalary);
    }

    public List<SalaryResponse> getDoctorSalaryHistory(Long doctorId) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor not found with ID: " + doctorId);
        }

        return salaryRepository.findByDoctorId(doctorId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<SalaryResponse> getAllSalaries() {
        return salaryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private SalaryResponse mapToResponse(Salary salary) {
        return SalaryResponse.builder()
                .id(salary.getId())
                .doctorId(salary.getDoctor().getId())
                .doctorName(salary.getDoctor().getUser().getName())
                .baseSalary(salary.getBaseSalary())
                .bonus(salary.getBonus())
                .paymentDate(salary.getPaymentDate())
                .paymentStatus(salary.getPaymentStatus())
                .build();
    }
}
