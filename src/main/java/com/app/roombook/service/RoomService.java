package com.app.roombook.service;

import com.app.roombook.entity.Room;
import com.app.roombook.exception.ResourceNotFoundException;
import com.app.roombook.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public Room createRoom(Room room) {

        if (room.getStatus() == null) {
            room.setStatus(
                    com.app.roombook.entity.RoomStatus.AVAILABLE
            );
        }

        return roomRepository.save(room);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Long id) {

        return roomRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Room with ID " + id + " not found."
                        )
                );
    }

    public Room updateRoom(
            Long id,
            Room roomDetails) {

        Room room = getRoomById(id);

        room.setRoomName(
                roomDetails.getRoomName()
        );

        room.setCapacity(
                roomDetails.getCapacity()
        );

        room.setProjector(
                roomDetails.isProjector()
        );

        room.setWhiteboard(
                roomDetails.isWhiteboard()
        );

        if (roomDetails.getStatus() != null) {

            room.setStatus(
                    roomDetails.getStatus()
            );
        }

        return roomRepository.save(room);
    }

    public void deleteRoom(Long id) {

        Room room = getRoomById(id);

        roomRepository.delete(room);
    }
}