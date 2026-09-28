package com.app.roombook.service;

import com.app.roombook.entity.Admin;
import com.app.roombook.repository.AdminRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    public Admin login(String email, String password) {

        return adminRepository
                .findByEmailAndPassword(email, password)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid admin email or password"
                        )
                );
    }
}