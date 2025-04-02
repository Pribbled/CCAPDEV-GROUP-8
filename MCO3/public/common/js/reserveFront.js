document.getElementById("fetch-seats").addEventListener("click", async () => {
    const lab = document.getElementById("lab-selection").value;
    const date = document.getElementById("date-selection").value;
    const startTime = document.getElementById("time-selection").value;
    const reserveButton = document.getElementById('reserve');
    const anonymousChecker = document.getElementById('anonymous_checker');
    const confirmationPopup = document.getElementById('confirmation-popup');
    const overlay = document.getElementById('overlay');
    const confirmReserveButton = document.getElementById('confirm-reserve');
    const cancelReserveButton = document.getElementById('cancel-reserve');

    if (!lab || !date || !startTime) {
        alert("Please select a lab, date, and time.");
        return;
    }

    let [hours, minutes] = startTime.split(":").map(Number);
    let period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    let formattedHours = hours.toString().padStart(2, '0');
    let formattedTime = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;

    try {
        const response = await fetch(`/api/seats?lab=${encodeURIComponent(lab)}&date=${encodeURIComponent(date)}&startTime=${encodeURIComponent(formattedTime)}`);
        const availableSeats = await response.json();
        console.log(availableSeats);

        const tableBody = document.getElementById("table-body");
        tableBody.innerHTML = "";

        if (availableSeats.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="2">No available seats</td></tr>`;
            return;
        }

        availableSeats.forEach(seat => {
            const row = document.createElement("tr");
            row.classList.add("available");
            row.innerHTML = `
                <tr>
                <td>${seat.seatNumber}</td>
                <td>${seat.status}</td>
                </tr>
            `;

            row.addEventListener("click", function () {
                row.classList.toggle("selected");
            });

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error fetching available seats:", error);
        alert("Failed to load available seats.");
    }

    reserveButton.addEventListener('click', () => {
        confirmationPopup.style.display = 'block';
        overlay.style.display = 'block';
    });

    confirmReserveButton.addEventListener('click', async () => {
        const lab = document.getElementById("lab-selection").value;
        const date = document.getElementById("date-selection").value;
        const startTime = document.getElementById("time-selection").value;
        const isAnonymous = anonymousChecker.checked;
        
        const selectedSeats = [];
        document.querySelectorAll(".selected").forEach(row => {
            selectedSeats.push({ seatNumber: parseInt(row.cells[0].textContent), status: "Reserved" });
        });
    
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }

        function formatTime(hours, minutes) {
            let period = hours >= 12 ? "PM" : "AM";
            hours = hours % 12 || 12;
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
        }
    
        let [startHours, startMinutes] = startTime.split(":").map(Number);
        const formattedStartTime = formatTime(startHours, startMinutes);
    
        let endHours = startHours;
        let endMinutes = startMinutes + 30;
        if (endMinutes >= 60) {
            endHours += 1;
            endMinutes -= 60;
        }
        const formattedEndTime = formatTime(endHours, endMinutes);
    
        const userEmail = "user@example.com"; //SESSION EMAIL
        const userName = isAnonymous ? "Anonymous" : "User Name"; //SESSION NAME
    
        const reservationData = {
            lab,
            date,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            seats: selectedSeats,
            name: userName,
            isAnonymous,
            email: userEmail
        };
    
        try {
            const response = await fetch('/reservationPage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reservationData)
            });
    
            const result = await response.json();
            if (response.ok) {
                alert("Reservation successful!");
                confirmationPopup.style.display = 'none';
                overlay.style.display = 'none';
                window.location.reload();
            } else {
                alert(`Reservation failed: ${result.error}`);
            }
        } catch (error) {
            console.error("Error sending reservation:", error);
            alert("Failed to reserve a seat.");
        }
    });

    cancelReserveButton.addEventListener('click', () => {
        confirmationPopup.style.display = 'none';
        overlay.style.display = 'none';
    });

});

document.getElementById("time-selection").addEventListener("change", function () {
    let [hours, minutes] = this.value.split(":").map(Number);
    if (minutes !== 0 && minutes !== 30) {
        minutes = minutes < 15 ? 0 : 30;
        this.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        alert("Only whole hours and half-hours are allowed!");
    }
});


document.getElementById("labtech").addEventListener("click", function () {
    window.location.href = "/reservationPageLabtech"; 
});

