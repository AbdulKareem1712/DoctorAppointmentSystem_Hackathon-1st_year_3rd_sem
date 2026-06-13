package com.hospital.doctorappointment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionRequest {

    @NotBlank(message = "Medicine details are required")
    private String medicineDetails;

    private String notes;
  ///Abdul Kareem 2500030144
}
