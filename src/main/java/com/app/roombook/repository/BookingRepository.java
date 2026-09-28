package com.app.roombook.repository;

import com.app.roombook.entity.Booking;
import com.app.roombook.entity.BookingStatus;
import com.app.roombook.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByRoomAndStatus(
            Room room,
            BookingStatus status
    );

    List<Booking> findByRoomAndStartTimeLessThanAndEndTimeGreaterThan(
            Room room,
            LocalDateTime endTime,
            LocalDateTime startTime
    );

    List<Booking> findByStatusAndStartTimeBefore(
            BookingStatus status,
            LocalDateTime startTime
    );
}