package com.hospital.doctorappointment.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleResponse {
    private Long id;
    private Long doctorId;
    private String doctorName;
    private LocalDate date;
    private String timeSlot;
    private Boolean isAvailable;
}
