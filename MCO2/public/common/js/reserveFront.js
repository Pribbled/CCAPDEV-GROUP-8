document.getElementById("fetch-seats").addEventListener("click", async () => {
    const lab = document.getElementById("lab-selection").value;
    const date = document.getElementById("date-selection").value;
    const startTime = document.getElementById("time-selection").value;

    if (!lab || !date || !startTime) {
        alert("Please select a lab, date, and time.");
        return;
    }

    let [hours, minutes] = startTime.split(":").map(Number);
    let period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    let formattedHours = hours.toString().padStart(2, '0');
    let formattedTime = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    console.log("⏰ Formatted Time:", formattedTime);

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
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("❌ Error fetching available seats:", error);
        alert("Failed to load available seats.");
    }
});
