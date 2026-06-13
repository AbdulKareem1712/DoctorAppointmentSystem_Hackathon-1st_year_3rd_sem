package com.hospital.doctorappointment.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalaryResponse {
    private Long id;
    private Long doctorId;
    private String doctorName;
    private Double baseSalary;
    private Double bonus;
    private LocalDate paymentDate;
    private String paymentStatus;
}
