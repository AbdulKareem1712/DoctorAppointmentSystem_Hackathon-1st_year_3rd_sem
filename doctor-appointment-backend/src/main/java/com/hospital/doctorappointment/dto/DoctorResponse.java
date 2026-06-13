package com.hospital.doctorappointment.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorResponse {
    private Long id;
    private Long userId;
    private String email;
    private String name;
    private String phone;
    private Long departmentId;
    private String departmentName;
    private String specialization;
    private Double salary;
}
