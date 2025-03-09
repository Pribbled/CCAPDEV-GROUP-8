document.getElementById("fetch-seats").addEventListener("click", async () => {
    const lab = document.getElementById("lab-selection").value;
    const date = document.getElementById("date-selection").value;
    const startTime = document.getElementById("time-selection").value;

    if (!lab || !date || !startTime) {
        alert("Please select a lab, date, and time.");
        return;
    }

    try {
        const response = await fetch(`/api/reservations?lab=${encodeURIComponent(lab)}&date=${encodeURIComponent(date)}&startTime=${encodeURIComponent(startTime)}`);
        const reservations = await response.json();

        const tableBody = document.getElementById("table-body");
        tableBody.innerHTML = "";

        if (reservations.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="2">No reservations found</td></tr>`;
            return;
        }

        reservations.forEach(reservation => {
            reservation.seats.forEach(seat => {
                const row = document.createElement("tr");
                row.classList.add(seat.status === "Reserved" ? "reserved" : "available");
                row.innerHTML = `
                    <td>${seat.seatNumber}</td>
                    <td>${seat.status}</td>
                `;
                tableBody.appendChild(row);
            });
        });
    } catch (error) {
        console.error("Error fetching reservations:", error);
        alert("Failed to load reservations.");
    }
});
