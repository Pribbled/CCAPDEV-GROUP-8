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

    confirmReserveButton.addEventListener('click', () => {
        const isAnonymous = anonymousChecker.checked;
        const reservationData = {
            lab: lab.value,
            date: date.value,
            isAnonymous: isAnonymous,
        };

        console.log('Reservation Data:', reservationData);
        alert('Reservation successful!');
        confirmationPopup.style.display = 'none';
        overlay.style.display = 'none';
    });

    cancelReserveButton.addEventListener('click', () => {
        confirmationPopup.style.display = 'none';
        overlay.style.display = 'none';
    });

});

document.getElementById("labtech").addEventListener("click", function () {
    window.location.href = "/reservationPageLabtech"; 
});

