const API_URL = "http://localhost:8080/api";


/* =====================================================
   LOAD ROOMS
===================================================== */

async function loadRooms() {

    const roomsContainer =
        document.getElementById("roomsContainer");

    if (!roomsContainer) {
        return;
    }

    try {

        const response =
            await fetch(API_URL + "/rooms");

        if (!response.ok) {
            throw new Error(
                "Unable to load rooms. Status: " +
                response.status
            );
        }

        const rooms =
            await response.json();

        console.log("Rooms loaded:", rooms);

        roomsContainer.innerHTML = "";

        if (!Array.isArray(rooms) || rooms.length === 0) {

            roomsContainer.innerHTML =
                "<p>No rooms available.</p>";

            return;
        }

        rooms.forEach(function (room) {

            const card =
                document.createElement("div");

            card.className = "room-card";

            const roomName =
                room.roomName || "Meeting Room";

            const capacity =
                room.capacity || 0;

            const projector =
                room.projector ? "Yes" : "No";

            const whiteboard =
                room.whiteboard ? "Yes" : "No";

            /*
             * If status is null from database,
             * treat it as AVAILABLE.
             */
            const status =
                room.status || "AVAILABLE";

            const isAvailable =
                status === "AVAILABLE";

            const buttonText =
                isAvailable
                    ? "Book This Room"
                    : "Not Available";

            const disabledAttribute =
                isAvailable
                    ? ""
                    : "disabled";

            card.innerHTML = `
                <h2>${roomName}</h2>

                <p>
                    <strong>Room ID:</strong>
                    ${room.id}
                </p>

                <p>
                    <strong>Capacity:</strong>
                    ${capacity}
                </p>

                <p>
                    <strong>Projector:</strong>
                    ${projector}
                </p>

                <p>
                    <strong>Whiteboard:</strong>
                    ${whiteboard}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${status}
                </p>

                <button
                    ${disabledAttribute}
                    onclick="bookRoom(${room.id})">

                    ${buttonText}

                </button>
            `;

            roomsContainer.appendChild(card);

        });

    } catch (error) {

        console.error(
            "LOAD ROOMS ERROR:",
            error
        );

        roomsContainer.innerHTML =
            "<p>Unable to load rooms. Please make sure the backend is running.</p>";
    }
}


/* =====================================================
   BOOK ROOM
===================================================== */

function bookRoom(roomId) {

    localStorage.setItem(
        "selectedRoomId",
        roomId
    );

    window.location.href =
        "booking.html";
}


/* =====================================================
   BOOKING
===================================================== */

const bookingForm =
    document.getElementById("bookingForm");

if (bookingForm) {

    const employeeIdInput =
        document.getElementById("employeeId");

    const roomIdInput =
        document.getElementById("roomId");

    const selectedRoomId =
        localStorage.getItem("selectedRoomId");

    /*
     * Automatically fill Room ID
     */
    if (
        selectedRoomId &&
        roomIdInput
    ) {

        roomIdInput.value =
            selectedRoomId;
    }


    bookingForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const employeeId =
                employeeIdInput.value.trim();

            const roomId =
                roomIdInput.value.trim();

            const startTime =
                document.getElementById(
                    "startTime"
                ).value;

            const endTime =
                document.getElementById(
                    "endTime"
                ).value;

            const bookingMessage =
                document.getElementById(
                    "bookingMessage"
                );


            /* CHECK EMPTY FIELDS */

            if (
                !employeeId ||
                !roomId ||
                !startTime ||
                !endTime
            ) {

                bookingMessage.textContent =
                    "Please fill all fields.";

                return;
            }


            /* CHECK TIME */

            if (
                new Date(endTime) <=
                new Date(startTime)
            ) {

                bookingMessage.textContent =
                    "End time must be after start time.";

                return;
            }


            try {

                const url =
                    API_URL +
                    "/bookings?roomId=" +
                    encodeURIComponent(roomId) +
                    "&employeeId=" +
                    encodeURIComponent(employeeId) +
                    "&startTime=" +
                    encodeURIComponent(
                        startTime + ":00"
                    ) +
                    "&endTime=" +
                    encodeURIComponent(
                        endTime + ":00"
                    );


                console.log(
                    "Booking request:",
                    url
                );


                const response =
                    await fetch(
                        url,
                        {
                            method: "POST"
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Booking failed. Status: " +
                        response.status
                    );
                }


                const booking =
                    await response.json();


                console.log(
                    "Booking successful:",
                    booking
                );


                localStorage.setItem(
                    "lastBooking",
                    JSON.stringify(booking)
                );


                window.location.href =
                    "success.html";

            } catch (error) {

                console.error(
                    "BOOKING ERROR:",
                    error
                );

                bookingMessage.textContent =
                    "Unable to create booking. Please try again.";
            }

        }
    );
}


/* =====================================================
   MY BOOKINGS
===================================================== */

async function loadMyBookings() {

    const container =
        document.getElementById(
            "bookingsContainer"
        );

    if (!container) {
        return;
    }


    /*
     * Since login has been removed,
     * Employee ID is taken from the booking page.
     *
     * If no employee ID is saved,
     * show all bookings.
     */

    try {

        const response =
            await fetch(
                API_URL + "/bookings"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load bookings. Status: " +
                response.status
            );
        }


        const bookings =
            await response.json();


        console.log(
            "Bookings loaded:",
            bookings
        );


        container.innerHTML = "";


        if (
            !Array.isArray(bookings) ||
            bookings.length === 0
        ) {

            container.innerHTML =
                "<p>No bookings available.</p>";

            return;
        }


        bookings.forEach(
            function (booking) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "booking-item";


                let roomId = "-";


                if (
                    booking.room &&
                    booking.room.id
                ) {

                    roomId =
                        booking.room.id;

                } else if (
                    booking.roomId
                ) {

                    roomId =
                        booking.roomId;
                }


                const status =
                    booking.status ||
                    "CONFIRMED";


                const checkInDisabled =
                    status === "CONFIRMED"
                        ? ""
                        : "disabled";


                const cancelDisabled =
                    status === "CONFIRMED"
                        ? ""
                        : "disabled";


                card.innerHTML = `

                    <h2>
                        Meeting Room ${roomId}
                    </h2>

                    <p>
                        <strong>Booking ID:</strong>
                        ${booking.id}
                    </p>

                    <p>
                        <strong>Start:</strong>
                        ${booking.startTime || "-"}
                    </p>

                    <p>
                        <strong>End:</strong>
                        ${booking.endTime || "-"}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${status}
                    </p>

                    <button
                        ${checkInDisabled}
                        onclick="checkInBooking(${booking.id})">

                        Check In

                    </button>

                    <button
                        ${cancelDisabled}
                        onclick="cancelBooking(${booking.id})">

                        Cancel Booking

                    </button>

                `;


                container.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(
            "BOOKINGS ERROR:",
            error
        );


        container.innerHTML =
            "<p>Unable to load bookings.</p>";
    }
}


/* =====================================================
   CHECK IN
===================================================== */

async function checkInBooking(
    bookingId
) {

    try {

        const response =
            await fetch(
                API_URL +
                "/bookings/" +
                bookingId +
                "/check-in",
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Check-in failed"
            );
        }


        alert(
            "Check-in successful!"
        );


        loadMyBookings();


    } catch (error) {

        console.error(
            "CHECK-IN ERROR:",
            error
        );


        alert(
            "Unable to check in."
        );
    }
}


/* =====================================================
   CANCEL BOOKING
===================================================== */

async function cancelBooking(
    bookingId
) {

    const confirmCancel =
        confirm(
            "Are you sure you want to cancel this booking?"
        );


    if (!confirmCancel) {
        return;
    }


    try {

        const response =
            await fetch(
                API_URL +
                "/bookings/" +
                bookingId +
                "/cancel",
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Cancellation failed"
            );
        }


        alert(
            "Booking cancelled successfully!"
        );


        loadMyBookings();


    } catch (error) {

        console.error(
            "CANCEL ERROR:",
            error
        );


        alert(
            "Unable to cancel booking."
        );
    }
}


/* =====================================================
   ADMIN ROOMS
===================================================== */

async function loadAdminRooms() {

    const container =
        document.getElementById(
            "adminRoomsContainer"
        );


    if (!container) {
        return;
    }


    try {

        const response =
            await fetch(
                API_URL + "/rooms"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load rooms"
            );
        }


        const rooms =
            await response.json();


        container.innerHTML = "";


        if (
            !Array.isArray(rooms) ||
            rooms.length === 0
        ) {

            container.innerHTML =
                "<p>No rooms found.</p>";

            return;
        }


        rooms.forEach(
            function (room) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "admin-room-card";


                const status =
                    room.status ||
                    "AVAILABLE";


                let button;


                if (
                    status === "MAINTENANCE"
                ) {

                    button =
                        `
                        <button
                            onclick="changeRoomStatus(
                                ${room.id},
                                'AVAILABLE'
                            )">

                            Set Available

                        </button>
                        `;

                } else {

                    button =
                        `
                        <button
                            onclick="changeRoomStatus(
                                ${room.id},
                                'MAINTENANCE'
                            )">

                            Set Maintenance

                        </button>
                        `;
                }


                card.innerHTML = `

                    <h2>
                        ${room.roomName || "Meeting Room"}
                    </h2>

                    <p>
                        <strong>Room ID:</strong>
                        ${room.id}
                    </p>

                    <p>
                        <strong>Capacity:</strong>
                        ${room.capacity || 0}
                    </p>

                    <p>
                        <strong>Projector:</strong>
                        ${room.projector ? "Yes" : "No"}
                    </p>

                    <p>
                        <strong>Whiteboard:</strong>
                        ${room.whiteboard ? "Yes" : "No"}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${status}
                    </p>

                    ${button}

                `;


                container.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(
            "ADMIN ROOM ERROR:",
            error
        );


        container.innerHTML =
            "<p>Unable to load rooms.</p>";
    }
}


/* =====================================================
   CHANGE ROOM STATUS
===================================================== */

async function changeRoomStatus(
    roomId,
    newStatus
) {

    try {

        const getResponse =
            await fetch(
                API_URL +
                "/rooms/" +
                roomId
            );


        if (!getResponse.ok) {

            throw new Error(
                "Room not found"
            );
        }


        const room =
            await getResponse.json();


        const updatedRoom = {

            roomName:
            room.roomName,

            capacity:
            room.capacity,

            projector:
            room.projector,

            whiteboard:
            room.whiteboard,

            status:
            newStatus
        };


        const response =
            await fetch(
                API_URL +
                "/rooms/" +
                roomId,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            updatedRoom
                        )
                }
            );


        if (!response.ok) {

            throw new Error(
                "Update failed"
            );
        }


        alert(
            "Room status changed to " +
            newStatus
        );


        loadAdminRooms();


    } catch (error) {

        console.error(
            "STATUS ERROR:",
            error
        );


        alert(
            "Unable to update room."
        );
    }
}


/* =====================================================
   ADD ROOM
===================================================== */

function showAddRoomForm() {

    const section =
        document.getElementById(
            "addRoomSection"
        );


    if (!section) {
        return;
    }


    if (
        section.style.display ===
        "none"
    ) {

        section.style.display =
            "block";

    } else {

        section.style.display =
            "none";
    }
}


const addRoomForm =
    document.getElementById(
        "addRoomForm"
    );


if (addRoomForm) {

    addRoomForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const roomName =
                document.getElementById(
                    "adminRoomName"
                ).value.trim();


            const capacity =
                Number(
                    document.getElementById(
                        "adminCapacity"
                    ).value
                );


            const projector =
                document.getElementById(
                    "adminProjector"
                ).value === "true";


            const whiteboard =
                document.getElementById(
                    "adminWhiteboard"
                ).value === "true";


            if (!roomName || capacity <= 0) {

                alert(
                    "Please enter a valid room name and capacity."
                );

                return;
            }


            const newRoom = {

                roomName:
                roomName,

                capacity:
                capacity,

                projector:
                projector,

                whiteboard:
                whiteboard,

                status:
                    "AVAILABLE"
            };


            try {

                const response =
                    await fetch(
                        API_URL +
                        "/rooms",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    newRoom
                                )
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Unable to create room"
                    );
                }


                alert(
                    "Room added successfully!"
                );


                addRoomForm.reset();


                loadAdminRooms();


            } catch (error) {

                console.error(
                    "ADD ROOM ERROR:",
                    error
                );


                alert(
                    "Unable to add room."
                );
            }

        }
    );
}


/* =====================================================
   START APPLICATION
===================================================== */

loadRooms();

loadMyBookings();

loadAdminRooms();