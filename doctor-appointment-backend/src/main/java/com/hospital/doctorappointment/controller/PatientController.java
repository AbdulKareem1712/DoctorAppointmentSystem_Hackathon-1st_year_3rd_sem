package com.hospital.doctorappointment.controller;

import com.hospital.doctorappointment.dto.AppointmentRequest;
import com.hospital.doctorappointment.dto.AppointmentResponse;
import com.hospital.doctorappointment.dto.DoctorResponse;
import com.hospital.doctorappointment.dto.ScheduleResponse;
import com.hospital.doctorappointment.service.AppointmentService;
import com.hospital.doctorappointment.service.DoctorService;
import com.hospital.doctorappointment.service.ScheduleService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

    private final DoctorService doctorService;
    private final AppointmentService appointmentService;
    private final ScheduleService scheduleService;

    public PatientController(DoctorService doctorService,
                             AppointmentService appointmentService,
                             ScheduleService scheduleService) {
        this.doctorService = doctorService;
        this.appointmentService = appointmentService;
        this.scheduleService = scheduleService;
    }

    // --- DOCTOR BROWSE & SEARCH ---

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorResponse>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/doctors/search")
    public ResponseEntity<List<DoctorResponse>> searchDoctors(@RequestParam String specialization) {
        return ResponseEntity.ok(doctorService.searchDoctorsBySpecialization(specialization));
    }

    @GetMapping("/doctors/{doctorId}/schedule")
    public ResponseEntity<List<ScheduleResponse>> getDoctorAvailableSlots(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(scheduleService.getAvailableScheduleByDoctorAndDate(doctorId, date));
    }

    // --- APPOINTMENTS BOOK & CANCEL ---

    @PostMapping("/appointments/book")
    public ResponseEntity<AppointmentResponse> bookAppointment(
            @Valid @RequestBody AppointmentRequest request,
            Principal principal) {
        return new ResponseEntity<>(appointmentService.bookAppointment(principal.getName(), request), HttpStatus.CREATED);
    }

    @PutMapping("/appointments/{id}/cancel")
    public ResponseEntity<AppointmentResponse> cancelAppointment(
            @PathVariable Long id,
            Principal principal) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(id, principal.getName()));
    }
  ///Abdul Kareem 2500030144
    @GetMapping("/appointments/history")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentHistory(Principal principal) {
        return ResponseEntity.ok(appointmentService.getPatientHistory(principal.getName()));
    }
}
