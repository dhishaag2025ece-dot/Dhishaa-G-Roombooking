package com.app.roombook.controller;

import com.app.roombook.entity.Booking;
import com.app.roombook.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestParam Long roomId,
            @RequestParam Long employeeId,
            @RequestParam LocalDateTime startTime,
            @RequestParam LocalDateTime endTime) {

        Booking booking = bookingService.createBooking(
                roomId,
                employeeId,
                startTime,
                endTime
        );

        return new ResponseEntity<>(
                booking,
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(
                bookingService.getAllBookings()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                bookingService.getBookingById(id)
        );
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                bookingService.cancelBooking(id)
        );
    }

    @PutMapping("/{id}/check-in")
    public ResponseEntity<Booking> checkIn(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                bookingService.checkIn(id)
        );
    }
}