package com.hospital.doctorappointment.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentResponse {
    private Long id;
    private Long doctorId;
    private String doctorName;
    private String specialization;
    private String departmentName;
    private Long patientId;
    private String patientName;
    private String patientEmail;
    private String patientPhone;
    private LocalDate appointmentDate;
    private String timeSlot;
    private String status;
    private PrescriptionResponse prescription;
  ///Abdul Kareem 2500030144
}
