package com.hospital.doctorappointment.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {
    private Long totalDoctors;
    private Long totalPatients;
    private Long totalAppointments;
    private Long appointmentsToday;
    private Double totalSalariesPaid;
  ///Abdul Kareem 2500030144
}
