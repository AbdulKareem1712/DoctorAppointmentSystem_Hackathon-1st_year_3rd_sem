package com.hospital.doctorappointment.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionResponse {
    private Long id;
    private Long appointmentId;
    private String medicineDetails;
    private String notes;
}
