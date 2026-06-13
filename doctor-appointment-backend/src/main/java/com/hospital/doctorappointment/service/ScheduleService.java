package com.hospital.doctorappointment.service;

import com.hospital.doctorappointment.dto.ScheduleRequest;
import com.hospital.doctorappointment.dto.ScheduleResponse;
import com.hospital.doctorappointment.entity.Doctor;
import com.hospital.doctorappointment.entity.Schedule;
import com.hospital.doctorappointment.exception.ResourceNotFoundException;
import com.hospital.doctorappointment.repository.DoctorRepository;
import com.hospital.doctorappointment.repository.ScheduleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final DoctorRepository doctorRepository;

    public ScheduleService(ScheduleRepository scheduleRepository, DoctorRepository doctorRepository) {
        this.scheduleRepository = scheduleRepository;
        this.doctorRepository = doctorRepository;
    }

    @Transactional
    public List<ScheduleResponse> setAvailability(String doctorEmail, ScheduleRequest request) {
        Doctor doctor = doctorRepository.findByUserEmail(doctorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with email: " + doctorEmail));

        List<ScheduleResponse> responses = new ArrayList<>();

        for (String slot : request.getTimeSlots()) {
            Optional<Schedule> existingSchedule = scheduleRepository.findByDoctorIdAndDateAndTimeSlot(
                    doctor.getId(), request.getDate(), slot
            );

            Schedule schedule;
            if (existingSchedule.isPresent()) {
                schedule = existingSchedule.get();
                // If it was previously set, we can keep it or make sure it's marked available if not already booked.
                // Let's keep existing and return it.
            } else {
                schedule = Schedule.builder()
                        .doctor(doctor)
                        .date(request.getDate())
                        .timeSlot(slot)
                        .isAvailable(true)
                        .build();
                schedule = scheduleRepository.save(schedule);
            }
            responses.add(mapToResponse(schedule));
        }

        return responses;
    }

    public List<ScheduleResponse> getScheduleByDoctor(Long doctorId) {
        return scheduleRepository.findByDoctorId(doctorId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ScheduleResponse> getAvailableScheduleByDoctorAndDate(Long doctorId, LocalDate date) {
        return scheduleRepository.findByDoctorIdAndDateAndIsAvailable(doctorId, date, true).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ScheduleResponse mapToResponse(Schedule schedule) {
        return ScheduleResponse.builder()
                .id(schedule.getId())
                .doctorId(schedule.getDoctor().getId())
                .doctorName(schedule.getDoctor().getUser().getName())
                .date(schedule.getDate())
                .timeSlot(schedule.getTimeSlot())
                .isAvailable(schedule.getIsAvailable())
                .build();
    }
}
