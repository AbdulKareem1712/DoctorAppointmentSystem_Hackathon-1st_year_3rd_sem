package com.hospital.doctorappointment.controller;

import com.hospital.doctorappointment.dto.*;
import com.hospital.doctorappointment.entity.Department;
import com.hospital.doctorappointment.entity.User;
import com.hospital.doctorappointment.service.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final DoctorService doctorService;
    private final DepartmentService departmentService;
    private final AppointmentService appointmentService;
    private final SalaryService salaryService;
    private final AdminDashboardService dashboardService;

    public AdminController(DoctorService doctorService,
                           DepartmentService departmentService,
                           AppointmentService appointmentService,
                           SalaryService salaryService,
                           AdminDashboardService dashboardService) {
        this.doctorService = doctorService;
        this.departmentService = departmentService;
        this.appointmentService = appointmentService;
        this.salaryService = salaryService;
        this.dashboardService = dashboardService;
    }

    // --- DOCTORS MGMT ---

    @PostMapping("/doctors")
    public ResponseEntity<DoctorResponse> addDoctor(@Valid @RequestBody DoctorRequest request) {
        return new ResponseEntity<>(doctorService.addDoctor(request), HttpStatus.CREATED);
    }

    @PutMapping("/doctors/{id}")
    public ResponseEntity<DoctorResponse> updateDoctor(@PathVariable Long id, @Valid @RequestBody DoctorRequest request) {
        return ResponseEntity.ok(doctorService.updateDoctor(id, request));
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<String> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok("Doctor deleted successfully.");
    }

    @GetMapping("/doctors/{id}")
    public ResponseEntity<DoctorResponse> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorResponse>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    // --- PATIENTS VIEW ---

    @GetMapping("/patients")
    public ResponseEntity<List<User>> getAllPatients() {
        return ResponseEntity.ok(doctorService.getAllPatients());
    }

    // --- APPOINTMENTS MGMT ---

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentResponse>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    // --- DEPARTMENTS MGMT ---

    @PostMapping("/departments")
    public ResponseEntity<Department> addDepartment(@Valid @RequestBody DepartmentRequest request) {
        return new ResponseEntity<>(departmentService.addDepartment(request), HttpStatus.CREATED);
    }

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    // --- SALARIES MGMT ---

    @PostMapping("/salaries")
    public ResponseEntity<SalaryResponse> paySalary(@Valid @RequestBody SalaryRequest request) {
        return new ResponseEntity<>(salaryService.paySalary(request), HttpStatus.CREATED);
    }

    @GetMapping("/doctors/{id}/salaries")
    public ResponseEntity<List<SalaryResponse>> getDoctorSalaryHistory(@PathVariable Long id) {
        return ResponseEntity.ok(salaryService.getDoctorSalaryHistory(id));
    }

    // --- DASHBOARD STATISTICS ---

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
        ///Abdul Kareem 2500030144
    }
}
