package com.hospital.doctorappointment.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleRequest {

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotEmpty(message = "Time slots list cannot be empty")
    private List<String> timeSlots;
}
