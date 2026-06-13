package com.hospital.doctorappointment.service;

import com.hospital.doctorappointment.dto.ReportDTO;

public interface ReportService {
    ReportDTO.AdminReportDTO getAdminReport();
    ReportDTO.DoctorReportDTO getDoctorReport(Long doctorUserId);
    ReportDTO.PatientReportDTO getPatientReport(Long patientUserId);
}
