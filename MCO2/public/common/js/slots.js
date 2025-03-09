document.addEventListener("DOMContentLoaded", function () {
    const labSelection = document.getElementById("lab-selection");
    const dateSelection = document.getElementById("date-selection");
    const timeSelection = document.getElementById("time-selection");
    const prevDayBtn = document.getElementById("prev-day");
    const reserveBtn = document.getElementById("reserve-slot");
    const nextDayBtn = document.getElementById("next-day");
    const techBtn = document.getElementById("techBtn");
    const tableBody = document.getElementById("table-body");

    let labData = {}; 
    async function fetchLabData() {
        try {
            const response = await fetch("/api/labs");
            
            const labs = await response.json();
            labs.forEach(lab => {
                labData[lab.name] = lab.totalSeats;
            });

            console.log("Lab data fetched:", labData);
        } catch (error) {
            console.error("Error fetching lab data:", error);
        }
    }

    function formatTime(timeValue) {
        if (!timeValue || !timeValue.includes(":")) return null;
        let [hours, minutes] = timeValue.split(":").map(Number);
        let period = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    }

    async function fetchReservations() {
        const lab = labSelection.value;
        const date = dateSelection.value;
        const time = timeSelection.value;
        const formattedTime = formatTime(time);
        const totalSeats = labData[lab];

        if (!lab || !date || !formattedTime) {
            console.warn("Please select lab, date, and time.");
            return;
        }

        console.log("Fetching reservations for:", { lab, date, formattedTime });

        const url = `/api/reservations?lab=${encodeURIComponent(lab)}&date=${encodeURIComponent(date)}&startTime=${encodeURIComponent(formattedTime)}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const reservations = await response.json();
            console.log("Received reservations:", reservations);

            tableBody.innerHTML = ""; 
            
            let seatMap = {};
            for (let i = 1; i <= totalSeats; i++) {
                seatMap[i] = { status: "Available", reservee: "None" };
            }

            reservations.forEach(reservation => {
                reservation.seats.forEach(seat => {
                    if (seatMap[seat.seatNumber]) {
                        seatMap[seat.seatNumber].status = "Reserved";
                        seatMap[seat.seatNumber].reservee = reservation.isAnonymous ? "Anonymous" : reservation.name;
                    }
                });
            });

            for (let i = 1; i <= totalSeats; i++) {
                const row = document.createElement("tr");

                const seatCell = document.createElement("td");
                seatCell.textContent = i;

                const statusCell = document.createElement("td");
                statusCell.textContent = seatMap[i].status;

                const reserveeCell = document.createElement("td");
                reserveeCell.textContent = seatMap[i].reservee;

                row.appendChild(seatCell);
                row.appendChild(statusCell);
                row.appendChild(reserveeCell);
                tableBody.appendChild(row);
            }
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    }

    function updateDate(days) {
        if (!dateSelection.value) {
            console.warn("No date selected.");
            return;
        }

        let currentDate = new Date(dateSelection.value);
        currentDate.setDate(currentDate.getDate() + days);
        dateSelection.value = currentDate.toISOString().split("T")[0];

        fetchReservations();
    }

    prevDayBtn.addEventListener("click", () => updateDate(-1));
    nextDayBtn.addEventListener("click", () => updateDate(1));
    reserveBtn.addEventListener("click", function () {
        window.location.href = "/reservationPage"; 
    });
    techBtn.addEventListener("click", function () {
        window.location.href = "/slotsLab"; 
    });

    [labSelection, dateSelection, timeSelection].forEach(element => {
        element.addEventListener("change", fetchReservations);
    });

    fetchLabData();
});
