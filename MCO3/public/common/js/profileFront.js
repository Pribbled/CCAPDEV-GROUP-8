    let selectedReservationId = null;

    function openEditOverlay(button) {
        const reservationBox = button.closest('.reservation-box');
        selectedReservationId = reservationBox.getAttribute('data-reservation-id');
        console.log(selectedReservationId);
        const lab = reservationBox.querySelector('p:nth-child(1)').textContent.replace('Lab: ', '');
        const date = reservationBox.querySelector('p:nth-child(2)').textContent.replace('Date: ', '');
        const time = reservationBox.querySelector('p:nth-child(3)').textContent.replace('Time: ', '');
        const seats = reservationBox.querySelector('p:nth-child(4)').textContent.replace('Seat Numbers Reserved: ', '');

        document.getElementById('edit-lab').value = lab;
        document.getElementById('edit-date').value = date;
        document.getElementById('edit-time').value = time.split('-')[0];
        document.getElementById('edit-seats').value = seats;

        document.getElementById('overlay').style.display = 'block';
        document.getElementById('edit-overlay').style.display = 'block';
    }

    function closeEditOverlay() {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('edit-overlay').style.display = 'none';
        selectedReservationId = null;
    }

    async function confirmEdit() {
        const newLab = document.getElementById('edit-lab').value;
        const newDate = document.getElementById('edit-date').value;
        const newTime = document.getElementById('edit-time').value;
        const newSeats = document.getElementById('edit-seats').value.split(',').map(s => parseInt(s.trim()));
        const isAnonymous = document.getElementById('edit-anonymous').checked;

        if (!selectedReservationId) {
            alert("No reservation selected.");
            return;
        }

        try {
            const response = await fetch('/profile/edit-reservation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reservationId: selectedReservationId,
                    lab: newLab,
                    date: newDate,
                    startTime: newTime,
                    seats: newSeats,
                    isAnonymous: isAnonymous
                })
            });

            const text = await response.text();
            try {
                var result = JSON.parse(text);
            } catch (error) {
                console.error("Invalid JSON response:", text);
                alert("Unexpected server response.");
                return;
            }

            if (response.ok) {
                alert("Reservation updated successfully!");
                window.location.reload();
            } else {
                alert(result.error || "Error updating reservation.");
            }
        } catch (error) {
            console.error("Error updating reservation:", error);
            alert("Failed to update reservation.");
        }
        
        closeEditOverlay();
    }

        function logout() {
            fetch('/logout', {
                method: 'GET',
                credentials: 'same-origin' 
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.message); 
                window.location.href = '/'; 
            })
            .catch(error => console.error('Logout error:', error));
        }

        function handleViewLabs() {
            window.location.href = '/slots';
        }

        function handleProfile() {
            window.location.href = '/profile';
        }

        function profileTechnician() {
            window.location.href = "/profileTechnician";
        }

        function deleteAccount() {
            let modal = document.createElement("div");
            modal.style.position = "fixed";
            modal.style.top = "0";
            modal.style.left = "0";
            modal.style.width = "100%";
            modal.style.height = "100%";
            modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            modal.style.display = "flex";
            modal.style.justifyContent = "center";
            modal.style.alignItems = "center";
            modal.style.zIndex = "1000";
        
            let modalContent = document.createElement("div");
            modalContent.style.backgroundColor = "white";
            modalContent.style.padding = "20px";
            modalContent.style.borderRadius = "10px";
            modalContent.style.textAlign = "center";
            modalContent.style.boxShadow = "0px 4px 6px rgba(0,0,0,0.1)";
            
            modalContent.innerHTML = `
                <p><strong>Deleting your account means cancelling all your current reservations.</strong></p>
                <button id="confirmDelete" style="background: red; color: white; padding: 10px; border: none; margin-right: 10px; cursor: pointer;">Confirm</button>
                <button id="cancelDelete" style="background: gray; color: white; padding: 10px; border: none; cursor: pointer;">Cancel</button>
            `;
        
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
        

            document.getElementById("confirmDelete").addEventListener("click", function () {
                alert("Account deleted successfully."); // Replace this with actual delete logic
                document.body.removeChild(modal);
            });
        
            document.getElementById("cancelDelete").addEventListener("click", function () {
                document.body.removeChild(modal);
            });
        }
        function toggleNameInput() {
            const nameElement = document.querySelector('.name');
            const currentName = nameElement.textContent.trim();
        
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.value = currentName;
            nameInput.className = 'name-input';
        
            nameInput.addEventListener('blur', () => {
                nameElement.innerHTML = `${nameInput.value} <button class="name-edit-button" onclick="toggleNameInput()">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Edit_icon_%28the_Noun_Project_30184%29.svg/150px-Edit_icon_%28the_Noun_Project_30184%29.svg.png" alt="Edit Icon" class="name-edit-button-icon">
                </button>`;
            });
        
            nameElement.innerHTML = '';
            nameElement.appendChild(nameInput);
            nameInput.focus();
        }

        document.addEventListener("DOMContentLoaded", () => {
            document.querySelectorAll(".cancel-button").forEach(button => {
                button.addEventListener("click", async (event) => {
                    const reservationBox = event.target.closest(".reservation-box");
                    const reservationId = reservationBox.getAttribute("data-reservation-id");
                    
                    if (!confirm("Are you sure you want to cancel this reservation?")) {
                        return;
                    }
                    
                    try {
                        const response = await fetch("/profile/cancel-reservation", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ reservationId })
                        });
                        
                        const result = await response.json();
                        if (response.ok) {
                            alert("Reservation canceled successfully!");
                            reservationBox.remove();
                        } else {
                            alert(result.error || "Error canceling reservation.");
                        }
                    } catch (error) {
                        console.error("Error canceling reservation:", error);
                        alert("Failed to cancel reservation.");
                    }
                });
            });
        });

    function openProfilePictureOverlay() {
        document.getElementById('profile-picture-overlay').style.display = 'block';
    }

    function closeProfilePictureOverlay() {
        document.getElementById('profile-picture-overlay').style.display = 'none';
    }

    async function updateProfilePicture() {
        const profilePictureURL = document.getElementById('profile-picture-url').value; // Get the URL from the input field
    
        try {
            const response = await fetch('/profile/update-picture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profilePicture: profilePictureURL })
            });
    
            const result = await response.json();
            if (response.ok) {
                // Update the profile picture on the page
                document.querySelector('.profile-container img').src = profilePictureURL;
                alert("Profile picture updated successfully!");
            } else {
                alert(result.error || "Error updating profile picture.");
            }
        } catch (error) {
            console.error("Error updating profile picture:", error);
            alert("Failed to update profile picture.");
        }
    }