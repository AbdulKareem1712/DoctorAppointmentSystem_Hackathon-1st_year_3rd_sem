package com.hospital.doctorappointment.repository;

import com.hospital.doctorappointment.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByDoctorId(Long doctorId);
    List<Schedule> findByDoctorIdAndDate(Long doctorId, LocalDate date);
    Optional<Schedule> findByDoctorIdAndDateAndTimeSlot(Long doctorId, LocalDate date, String timeSlot);
    List<Schedule> findByDoctorIdAndDateAndIsAvailable(Long doctorId, LocalDate date, Boolean isAvailable);
}
