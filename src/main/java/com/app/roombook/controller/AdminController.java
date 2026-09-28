package com.app.roombook.controller;

import com.app.roombook.entity.Admin;
import com.app.roombook.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping
    public ResponseEntity<Admin> createAdmin(
            @RequestBody Admin admin) {

        return new ResponseEntity<>(
                adminService.createAdmin(admin),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestParam String email,
            @RequestParam String password) {

        try {

            Admin admin =
                    adminService.login(
                            email,
                            password
                    );

            return ResponseEntity.ok(admin);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid admin email or password");
        }
    }
}