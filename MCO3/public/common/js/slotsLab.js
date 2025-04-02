document.addEventListener("DOMContentLoaded", function () {
    const labSelection = document.getElementById("lab-selection");
    const timeSelection = document.getElementById("time-selection");
    const reserveBtn = document.getElementById("reserve-slot");
    const slotsBtn = document.getElementById("slotsBtn");
    const tableBody = document.getElementById("table-body");

    async function removeSlot(button, reservationId) {
        if (!confirm("Are you sure you want to remove this reservation?")) {
            return;
        }
    
        try {
            const response = await fetch(`/api/reservations/${reservationId}`, {
                method: "DELETE"
            });
    
            if (response.ok) {
                alert("Reservation removed successfully.");
                fetchReservations();
            } else {
                alert("Failed to remove reservation.");
            }
        } catch (error) {
            console.error("Error removing reservation:", error);
        }
    }
    

    function formatTime(timeValue) {
        if (!timeValue || !timeValue.includes(":")) return null;
        let [hours, minutes] = timeValue.split(":").map(Number);
        let period = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    }

    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const day = today.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
    

    async function fetchReservations() {
        const lab = labSelection.value;
        const date = getTodayDate();
        console.log(date);
        const time = timeSelection.value;
        const formattedTime = formatTime(time);

        if (!lab || !date || !formattedTime) {
            console.warn("Please select lab, date, and time.");
            return;
        }

        console.log("Fetching reservations for:", { lab, date, formattedTime });

        const url = `/api/reservations?lab=${encodeURIComponent(lab)}&date=${encodeURIComponent(date)}&startTime=${encodeURIComponent(formattedTime)}`;

        try {
            const response = await fetch(url);
            
            const reservations = await response.json();
            console.log("Received reservations:", reservations);

            tableBody.innerHTML = ""; 
            const reservedRows = reservations.map(reservation => {
                return {
                    reservationId: reservation._id,
                    lab: reservation.lab,
                    reservee: reservation.isAnonymous ? "Anonymous" : reservation.name,
                    seats: reservation.seats.map(seat => seat.seatNumber).join(", "),
                    startTime: reservation.startTime
                };
            });
             

            if (reservedRows.length === 0) {
                console.log("No reservations found.");
                tableBody.innerHTML = "<tr><td colspan='4'>No reservations found.</td></tr>";
                return;
            }

            reservedRows.forEach(seat => {
                const row = document.createElement("tr");
            
                const seatCell = document.createElement("td");
                seatCell.textContent = seat.seats;
            
                const statusCell = document.createElement("td");
                statusCell.textContent = "Reserved";
            
                const reserveeCell = document.createElement("td");
                if (seat.reservee !== "Anonymous") {
                    const profileLink = document.createElement("a");
                    profileLink.href = `/profile`;
                    profileLink.textContent = seat.reservee;
                    profileLink.classList.add("reservee-link");
                    reserveeCell.appendChild(profileLink);
                } else {
                    reserveeCell.textContent = seat.reservee;
                }
            
                const actionCell = document.createElement("td");

                const reservationTime = new Date(`${getTodayDate()}T${timeSelection.value}`);
                const currentTime = new Date();
                const timeDifference = (currentTime - reservationTime) / (1000 * 60);

                if (timeDifference >= 10) {
                    const removeButton = document.createElement("button");
                    removeButton.textContent = "Remove";
                    removeButton.classList.add("cancel-slot");
                    if (seat.reservationId) {
                        removeButton.onclick = function () {
                            removeSlot(this, seat.reservationId);
                        };
                    } else {
                        console.error("Missing reservationId for seat:", seat);
                    }
                    actionCell.appendChild(removeButton);
                }
                
                row.appendChild(seatCell);
                row.appendChild(statusCell);
                row.appendChild(reserveeCell);
                row.appendChild(actionCell);
            
                tableBody.appendChild(row);
            });
            

        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    }
    reserveBtn.addEventListener("click", function () {
        window.location.href = "/reservationPageLabtech";
    });

    // slotsBtn.addEventListener("click", function () {
    //     window.location.href = "/slots";
    // });

    [labSelection, timeSelection].forEach(element => {
        element.addEventListener("change", fetchReservations);
    });

});
