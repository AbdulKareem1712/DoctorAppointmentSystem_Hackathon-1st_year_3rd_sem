package com.hospital.doctorappointment.service;

import com.hospital.doctorappointment.dto.PrescriptionRequest;
import com.hospital.doctorappointment.dto.PrescriptionResponse;
import com.hospital.doctorappointment.entity.Appointment;
import com.hospital.doctorappointment.entity.AppointmentStatus;
import com.hospital.doctorappointment.entity.Prescription;
import com.hospital.doctorappointment.exception.BadRequestException;
import com.hospital.doctorappointment.exception.ResourceNotFoundException;
import com.hospital.doctorappointment.repository.AppointmentRepository;
import com.hospital.doctorappointment.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;

    public PrescriptionService(PrescriptionRepository prescriptionRepository,
                               AppointmentRepository appointmentRepository) {
        this.prescriptionRepository = prescriptionRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @Transactional
    public PrescriptionResponse addPrescription(String doctorEmail, Long appointmentId, PrescriptionRequest request) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + appointmentId));

        // Check if doctor matches
        if (!appointment.getDoctor().getUser().getEmail().equalsIgnoreCase(doctorEmail)) {
            throw new BadRequestException("You are not the designated doctor for this appointment!");
        }

        // Must be in ACCEPTED status to complete and prescribe
        if (appointment.getStatus() != AppointmentStatus.ACCEPTED) {
            throw new BadRequestException("Appointments must be ACCEPTED before writing a prescription!");
        }

        // Check if prescription already exists
        if (prescriptionRepository.findByAppointmentId(appointmentId).isPresent()) {
            throw new BadRequestException("A prescription already exists for this appointment!");
        }
      ///Abdul Kareem 2500030144
        Prescription prescription = Prescription.builder()
                .appointment(appointment)
                .medicineDetails(request.getMedicineDetails())
                .notes(request.getNotes())
                .build();

        Prescription savedPrescription = prescriptionRepository.save(prescription);

        // Mark appointment as COMPLETED
        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);

        return PrescriptionResponse.builder()
                .id(savedPrescription.getId())
                .appointmentId(appointmentId)
                .medicineDetails(savedPrescription.getMedicineDetails())
                .notes(savedPrescription.getNotes())
                .build();
    }

    public PrescriptionResponse getPrescriptionByAppointment(Long appointmentId) {
        Prescription prescription = prescriptionRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found for appointment ID: " + appointmentId));

        return PrescriptionResponse.builder()
                .id(prescription.getId())
                .appointmentId(appointmentId)
                .medicineDetails(prescription.getMedicineDetails())
                .notes(prescription.getNotes())
                .build();
    }
}
