package com.hospital.doctorappointment.controller;

import com.hospital.doctorappointment.dto.*;
import com.hospital.doctorappointment.entity.AppointmentStatus;
import com.hospital.doctorappointment.entity.User;
import com.hospital.doctorappointment.service.AppointmentService;
import com.hospital.doctorappointment.service.PrescriptionService;
import com.hospital.doctorappointment.service.ScheduleService;
import com.hospital.doctorappointment.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/doctor")
public class DoctorController {

    private final AppointmentService appointmentService;
    private final ScheduleService scheduleService;
    private final PrescriptionService prescriptionService;
    private final DoctorService doctorService;

    public DoctorController(AppointmentService appointmentService,
                            ScheduleService scheduleService,
                            PrescriptionService prescriptionService,
                            DoctorService doctorService) {
        this.appointmentService = appointmentService;
        this.scheduleService = scheduleService;
        this.prescriptionService = prescriptionService;
        this.doctorService = doctorService;
    }

    // --- APPOINTMENTS VIEW & MANAGEMENT ---

    @GetMapping("/appointments/today")
    public ResponseEntity<List<AppointmentResponse>> getTodayAppointments(Principal principal) {
        return ResponseEntity.ok(appointmentService.getDoctorAppointmentsToday(principal.getName()));
    }

    @GetMapping("/appointments/upcoming")
    public ResponseEntity<List<AppointmentResponse>> getUpcomingAppointments(Principal principal) {
        return ResponseEntity.ok(appointmentService.getDoctorUpcomingAppointments(principal.getName()));
    }

    @GetMapping("/appointments/{id}/patient")
    public ResponseEntity<User> getPatientDetails(@PathVariable Long id, Principal principal) {
        AppointmentResponse appointment = appointmentService.getAppointmentById(id);
        // Verify this doctor is indeed assigned to the appointment
        DoctorResponse doctor = doctorService.getDoctorByEmail(principal.getName());
        if (!appointment.getDoctorId().equals(doctor.getId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        // Fetch patient
        List<User> patients = doctorService.getAllPatients();
        User patient = patients.stream()
                .filter(u -> u.getId().equals(appointment.getPatientId()))
                .findFirst()
                .orElse(null);
        return ResponseEntity.ok(patient);
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<AppointmentResponse> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam AppointmentStatus status,
            Principal principal) {
        return ResponseEntity.ok(appointmentService.updateStatusByDoctor(id, principal.getName(), status));
    }

    @PostMapping("/appointments/{id}/complete")
    public ResponseEntity<PrescriptionResponse> completeAppointment(
            @PathVariable Long id,
            @Valid @RequestBody PrescriptionRequest request,
            Principal principal) {
        return new ResponseEntity<>(prescriptionService.addPrescription(principal.getName(), id, request), HttpStatus.CREATED);
    }

    // --- SCHEDULE MGMT ---

    @PostMapping("/schedule")
    public ResponseEntity<List<ScheduleResponse>> setAvailability(
            @Valid @RequestBody ScheduleRequest request,
            Principal principal) {
        return new ResponseEntity<>(scheduleService.setAvailability(principal.getName(), request), HttpStatus.CREATED);
    }
  ///Abdul Kareem 2500030144
    @GetMapping("/schedule")
    public ResponseEntity<List<ScheduleResponse>> getOwnSchedule(Principal principal) {
        DoctorResponse doctor = doctorService.getDoctorByEmail(principal.getName());
        return ResponseEntity.ok(scheduleService.getScheduleByDoctor(doctor.getId()));
    }
}
