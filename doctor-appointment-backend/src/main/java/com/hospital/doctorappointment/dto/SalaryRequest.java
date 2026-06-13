package com.hospital.doctorappointment.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalaryRequest {

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    @NotNull(message = "Base salary is required")
    @Min(value = 0, message = "Base salary cannot be negative")
    private Double baseSalary;

    @Min(value = 0, message = "Bonus cannot be negative")
    private Double bonus;

    @NotBlank(message = "Payment status is required")
    private String paymentStatus; // e.g. "PAID"
}
