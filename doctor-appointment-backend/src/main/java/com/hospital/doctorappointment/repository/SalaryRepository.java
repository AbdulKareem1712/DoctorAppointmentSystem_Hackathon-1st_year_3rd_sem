package com.hospital.doctorappointment.repository;

import com.hospital.doctorappointment.entity.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalaryRepository extends JpaRepository<Salary, Long> {
    List<Salary> findByDoctorId(Long doctorId);
}
