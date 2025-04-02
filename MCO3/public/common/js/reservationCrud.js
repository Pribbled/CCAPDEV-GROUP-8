// // CREATE
// document.getElementById('createReservationForm').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const data = Object.fromEntries(formData.entries());
//     data.seats = [{ seatNumber: 1 }]; // Default seat, adjust as needed
  
//     try {
//       const response = await fetch('/api/crud/reservations', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data)
//       });
      
//       if (response.ok) {
//         alert('Reservation created!');
//         location.reload(); // Refresh to show new reservation
//       } else {
//         const error = await response.json();
//         alert(`Error: ${error.error}`);
//       }
//     } catch (err) {
//       console.error('Failed to create reservation:', err);
//     }
//   });
  
//   // DELETE
//   document.querySelectorAll('.delete-btn').forEach(btn => {
//     btn.addEventListener('click', async () => {
//       const reservationId = btn.closest('li').dataset.id;
//       if (confirm('Delete this reservation?')) {
//         try {
//           const response = await fetch(`/api/crud/reservations/${reservationId}`, {
//             method: 'DELETE'
//           });
//           if (response.ok) location.reload();
//         } catch (err) {
//           console.error('Delete failed:', err);
//         }
//       }
//     });
//   });
  
//   // UPDATE
//   async function updateReservation(id, newData) {
//     try {
//       const response = await fetch(`/api/crud/reservations/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newData)
//       });
//       return await response.json();
//     } catch (err) {
//       console.error('Update failed:', err);
//     }
//   }