package com.hospital.doctorappointment.config;

import com.hospital.doctorappointment.entity.Department;
import com.hospital.doctorappointment.entity.Role;
import com.hospital.doctorappointment.entity.User;
import com.hospital.doctorappointment.repository.DepartmentRepository;
import com.hospital.doctorappointment.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           DepartmentRepository departmentRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        bootstrapAdminUser();
        bootstrapDepartments();
    }

    private void bootstrapAdminUser() {
        String adminEmail = "admin@hospital.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin123"))
                    .name("Hospital Admin")
                    .phone("1234567890")
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("System administrator account has been bootstrapped: " + adminEmail);
        }
    }

    private void bootstrapDepartments() {
        List<String> defaultDeptNames = Arrays.asList("Cardiology", "Pediatrics", "Dermatology", "Neurology", "General Medicine");
        List<String> defaultDeptDescriptions = Arrays.asList(
                "Heart and blood vessel disorders and treatments",
                "Medical care of infants, children, and adolescents",
                "Skin, nails, hair and its diseases and treatments",
                "Disorders of the nervous system and brain",
                "Primary care, diagnostics, and general wellness treatments"
        );

        for (int i = 0; i < defaultDeptNames.size(); i++) {
            String name = defaultDeptNames.get(i);
            if (!departmentRepository.existsByName(name)) {
                Department dept = Department.builder()
                        .name(name)
                        .description(defaultDeptDescriptions.get(i))
                        .build();
                departmentRepository.save(dept);
                System.out.println("Bootstrapped department: " + name);
            }
        }
    }
}
