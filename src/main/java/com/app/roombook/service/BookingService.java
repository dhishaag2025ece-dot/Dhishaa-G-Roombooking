package com.app.roombook.service;

import com.app.roombook.entity.Booking;
import com.app.roombook.entity.BookingStatus;
import com.app.roombook.entity.Employee;
import com.app.roombook.entity.Room;
import com.app.roombook.exception.BookingConflictException;
import com.app.roombook.exception.ResourceNotFoundException;
import com.app.roombook.repository.BookingRepository;
import com.app.roombook.repository.EmployeeRepository;
import com.app.roombook.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final EmployeeRepository employeeRepository;

    public BookingService(BookingRepository bookingRepository,
                          RoomRepository roomRepository,
                          EmployeeRepository employeeRepository) {

        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.employeeRepository = employeeRepository;
    }

    public Booking createBooking(Long roomId,
                                 Long employeeId,
                                 LocalDateTime startTime,
                                 LocalDateTime endTime) {

        if (startTime == null || endTime == null) {
            throw new IllegalArgumentException(
                    "Start time and end time are required.");
        }

        if (!endTime.isAfter(startTime)) {
            throw new IllegalArgumentException(
                    "End time must be after start time.");
        }

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Room with ID " + roomId + " not found."));

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee with ID " + employeeId + " not found."));

        List<Booking> conflictingBookings =
                bookingRepository
                        .findByRoomAndStartTimeLessThanAndEndTimeGreaterThan(
                                room,
                                endTime,
                                startTime
                        );

        boolean hasConflict = conflictingBookings.stream()
                .anyMatch(booking ->
                        booking.getStatus() == BookingStatus.CONFIRMED);

        if (hasConflict) {
            throw new BookingConflictException(
                    "Room is already booked for the selected time.");
        }

        Booking booking = new Booking(
                room,
                employee,
                startTime,
                endTime
        );

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking with ID " + id + " not found."));
    }

    public Booking cancelBooking(Long id) {
        Booking booking = getBookingById(id);

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new IllegalArgumentException(
                    "Only confirmed bookings can be cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        return bookingRepository.save(booking);
    }

    public Booking checkIn(Long id) {
        Booking booking = getBookingById(id);

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new IllegalArgumentException(
                    "Only confirmed bookings can be checked in.");
        }

        booking.setCheckedIn(true);

        return bookingRepository.save(booking);
    }
}