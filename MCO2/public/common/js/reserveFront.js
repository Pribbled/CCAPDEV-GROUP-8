document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById('table-body');

    async function fetchReservations() {
        try {
            const response = await fetch('/api/reservations');
            const reservations = await response.json();
            tableBody.innerHTML = '';

            reservations.forEach(reservation => {
                reservation.seats.forEach(seat => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${seat.seatNumber}</td>
                        <td>${seat.status}</td>
                    `;
                    row.classList.add(seat.status === 'Reserved' ? 'reserved' : 'available');
                    tableBody.appendChild(row);
                });
            });
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    }

    fetchReservations();
});
