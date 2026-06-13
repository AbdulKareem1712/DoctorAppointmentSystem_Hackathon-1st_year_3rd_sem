package com.hospital.doctorappointment.repository;

import com.hospital.doctorappointment.entity.Appointment;
import com.hospital.doctorappointment.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);   ///Abdul Kareem 2500030144
    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, LocalDate date);
    List<Appointment> findByDoctorIdAndAppointmentDateAfter(Long doctorId, LocalDate date);
    boolean existsByDoctorIdAndAppointmentDateAndTimeSlotAndStatusIn(
            Long doctorId, LocalDate date, String timeSlot, List<AppointmentStatus> statuses
    );
    long countByAppointmentDate(LocalDate date);
    
    // For Reporting
    List<Appointment> findByAppointmentDateBetween(LocalDate start, LocalDate end);
    List<Appointment> findByDoctorIdAndAppointmentDateBetween(Long doctorId, LocalDate start, LocalDate end);
    List<Appointment> findByStatus(AppointmentStatus status);
}
