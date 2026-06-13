package com.hospital.doctorappointment.service;

import com.hospital.doctorappointment.dto.AppointmentRequest;
import com.hospital.doctorappointment.dto.AppointmentResponse;
import com.hospital.doctorappointment.dto.PrescriptionResponse;
import com.hospital.doctorappointment.entity.*;
import com.hospital.doctorappointment.exception.BadRequestException;
import com.hospital.doctorappointment.exception.ResourceNotFoundException;
import com.hospital.doctorappointment.repository.AppointmentRepository;
import com.hospital.doctorappointment.repository.DoctorRepository;
import com.hospital.doctorappointment.repository.PrescriptionRepository;
import com.hospital.doctorappointment.repository.ScheduleRepository;
import com.hospital.doctorappointment.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;
    private final PrescriptionRepository prescriptionRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              DoctorRepository doctorRepository,
                              UserRepository userRepository,
                              ScheduleRepository scheduleRepository,
                              PrescriptionRepository prescriptionRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.scheduleRepository = scheduleRepository;
        this.prescriptionRepository = prescriptionRepository;
    }

    @Transactional
    public AppointmentResponse bookAppointment(String patientEmail, AppointmentRequest request) {
        User patient = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with email: " + patientEmail));

        if (patient.getRole() != Role.PATIENT) {
            throw new BadRequestException("Only patients can book appointments!");
        }

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + request.getDoctorId()));

        // Check if doctor has set availability for this slot
        Schedule schedule = scheduleRepository.findByDoctorIdAndDateAndTimeSlot(
                doctor.getId(), request.getAppointmentDate(), request.getTimeSlot()
        ).orElseThrow(() -> new BadRequestException("Doctor is not available at this time slot!"));

        if (!schedule.getIsAvailable()) {
            throw new BadRequestException("This time slot is already booked!");
        }

        // Check if there is already an active booking for this doctor/slot (Double insurance check)
        List<AppointmentStatus> activeStatuses = Arrays.asList(
                AppointmentStatus.PENDING, AppointmentStatus.ACCEPTED, AppointmentStatus.COMPLETED
        );
        boolean clashExists = appointmentRepository.existsByDoctorIdAndAppointmentDateAndTimeSlotAndStatusIn(
                doctor.getId(), request.getAppointmentDate(), request.getTimeSlot(), activeStatuses
        );

        if (clashExists) {
            schedule.setIsAvailable(false);
            scheduleRepository.save(schedule);
            throw new BadRequestException("This time slot is already occupied!");
        }

        // Create appointment
        Appointment appointment = Appointment.builder()
                .doctor(doctor)
                .patient(patient)
                .appointmentDate(request.getAppointmentDate())
                .timeSlot(request.getTimeSlot())
                .status(AppointmentStatus.PENDING)
                .build();

        // Save appointment
        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Mark slot as booked
        schedule.setIsAvailable(false);
        scheduleRepository.save(schedule);

        return mapToResponse(savedAppointment);
    }

    @Transactional
    public AppointmentResponse cancelAppointment(Long appointmentId, String userEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + appointmentId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        // Security check: Only the booking patient or an admin can cancel
        if (user.getRole() == Role.PATIENT && !appointment.getPatient().getEmail().equalsIgnoreCase(userEmail)) {
            throw new BadRequestException("You are not authorized to cancel this appointment!");
        }

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new BadRequestException("Appointment is already cancelled!");
        }
        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed appointment!");
        }

        // Update status
        appointment.setStatus(AppointmentStatus.CANCELLED);
        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Release schedule slot
        releaseSlot(appointment.getDoctor().getId(), appointment.getAppointmentDate(), appointment.getTimeSlot());

        return mapToResponse(savedAppointment);
    }

    @Transactional
    public AppointmentResponse updateStatusByDoctor(Long appointmentId, String doctorEmail, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + appointmentId));

        if (!appointment.getDoctor().getUser().getEmail().equalsIgnoreCase(doctorEmail)) {
            throw new BadRequestException("You are not authorized to manage this appointment!");
        }

        if (status != AppointmentStatus.ACCEPTED && status != AppointmentStatus.REJECTED) {
            throw new BadRequestException("Doctors can only ACCEPT or REJECT pending appointments!");
        }

        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new BadRequestException("Can only update status of PENDING appointments!");
        }

        appointment.setStatus(status);
        Appointment savedAppointment = appointmentRepository.save(appointment);

        // If rejected, release the schedule slot
        if (status == AppointmentStatus.REJECTED) {
            releaseSlot(appointment.getDoctor().getId(), appointment.getAppointmentDate(), appointment.getTimeSlot());
        }

        return mapToResponse(savedAppointment);
    }

    private void releaseSlot(Long doctorId, LocalDate date, String timeSlot) {
        scheduleRepository.findByDoctorIdAndDateAndTimeSlot(doctorId, date, timeSlot)
                .ifPresent(schedule -> {
                    schedule.setIsAvailable(true);
                    scheduleRepository.save(schedule);
                });
    }

    public List<AppointmentResponse> getPatientHistory(String patientEmail) {
        User patient = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with email: " + patientEmail));

        return appointmentRepository.findByPatientId(patient.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getDoctorAppointmentsToday(String doctorEmail) {
        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with email: " + doctorEmail));

        return appointmentRepository.findByDoctorIdAndAppointmentDate(doctor.getId(), LocalDate.now()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getDoctorUpcomingAppointments(String doctorEmail) {
        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with email: " + doctorEmail));

        return appointmentRepository.findByDoctorIdAndAppointmentDateAfter(doctor.getId(), LocalDate.now()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AppointmentResponse getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));
        return mapToResponse(appointment);
    }

    private AppointmentResponse mapToResponse(Appointment appointment) {
        PrescriptionResponse prescriptionResponse = null;
        var prescriptionOpt = prescriptionRepository.findByAppointmentId(appointment.getId());
        if (prescriptionOpt.isPresent()) {
            Prescription p = prescriptionOpt.get();
            prescriptionResponse = PrescriptionResponse.builder()
                    .id(p.getId())
                    .appointmentId(appointment.getId())
                    .medicineDetails(p.getMedicineDetails())
                    .notes(p.getNotes())
                    .build();
        }

        return AppointmentResponse.builder()
                .id(appointment.getId())
                .doctorId(appointment.getDoctor().getId())
                .doctorName(appointment.getDoctor().getUser().getName())
                .specialization(appointment.getDoctor().getSpecialization())
                .departmentName(appointment.getDoctor().getDepartment() != null ? appointment.getDoctor().getDepartment().getName() : null)
                .patientId(appointment.getPatient().getId())
                .patientName(appointment.getPatient().getName())
                .patientEmail(appointment.getPatient().getEmail())
                .patientPhone(appointment.getPatient().getPhone())
                .appointmentDate(appointment.getAppointmentDate())
                .timeSlot(appointment.getTimeSlot())
                .status(appointment.getStatus().name())
                .prescription(prescriptionResponse)
                .build();
    }
}
