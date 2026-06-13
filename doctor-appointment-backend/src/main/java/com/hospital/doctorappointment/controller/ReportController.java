package com.hospital.doctorappointment.controller;

import com.hospital.doctorappointment.dto.ReportDTO;
import com.hospital.doctorappointment.security.CustomUserDetails;
import com.hospital.doctorappointment.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/admin/reports")
    // @PreAuthorize("hasRole('ADMIN')") - already configured in SecurityConfig
    public ResponseEntity<ReportDTO.AdminReportDTO> getAdminReport() {
        return ResponseEntity.ok(reportService.getAdminReport());
    }

    @GetMapping("/doctor/reports")
    // @PreAuthorize("hasRole('DOCTOR')") - already configured in SecurityConfig
    public ResponseEntity<ReportDTO.DoctorReportDTO> getDoctorReport(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(reportService.getDoctorReport(userDetails.getUser().getId()));
    }

    @GetMapping("/patient/reports")
    // @PreAuthorize("hasRole('PATIENT')") - already configured in SecurityConfig
    public ResponseEntity<ReportDTO.PatientReportDTO> getPatientReport(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(reportService.getPatientReport(userDetails.getUser().getId()));
    }
}
