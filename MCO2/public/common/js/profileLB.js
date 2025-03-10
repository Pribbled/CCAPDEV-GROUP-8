let selectedReservation = null;

        function openEditOverlay(button) {
            const reservationBox = button.closest('.reservation-box');
            const lab = reservationBox.querySelector('p:nth-child(1)').textContent.replace('Lab: ', '');
            const date = reservationBox.querySelector('p:nth-child(2)').textContent.replace('Date: ', '');
            const time = reservationBox.querySelector('p:nth-child(3)').textContent.replace('Time: ', '');

            document.getElementById('edit-lab').value = lab;
            document.getElementById('edit-date').value = date;
            document.getElementById('edit-time').value = time.split('-')[0]; // Set the start time

            document.getElementById('overlay').style.display = 'block';
            document.getElementById('edit-overlay').style.display = 'block';

            selectedReservation = reservationBox;
        }

        function closeEditOverlay() {
            document.getElementById('overlay').style.display = 'none';
            document.getElementById('edit-overlay').style.display = 'none';
            selectedReservation = null;
        }

        function confirmEdit() {
            const newLab = document.getElementById('edit-lab').value;
            const newDate = document.getElementById('edit-date').value;
            const newTime = document.getElementById('edit-time').value;

            if (selectedReservation) {
                selectedReservation.querySelector('p:nth-child(1)').textContent = `Lab: ${newLab}`;
                selectedReservation.querySelector('p:nth-child(2)').textContent = `Date: ${newDate}`;
                selectedReservation.querySelector('p:nth-child(3)').textContent = `Time: ${newTime}-${newTime + 1}:30`; // Adjust end time as needed

                const isSlotAvailable = true; 
                if (isSlotAvailable) {
                    alert('Reservation updated successfully!');
                } else {
                    alert('The selected time slot is not available.');
                }
            }

            closeEditOverlay();
        }

        function logout() {
            window.location.href = '/';
        }

        function handleViewLabs() {
            window.location.href = '/slots';
        }

        function handleProfile() {
            window.location.href = '/profile';
        }

        function profileVisit() {
            window.location.href = "/profileVisit";
        }

        function profileStudent() {
            window.location.href = "/profile";
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
                alert("Account deleted successfully.");
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