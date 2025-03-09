function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true'; 
}

function handleProfile() {
    if (!isLoggedIn()) {
        window.location.href = '/login'; 
    } else {
        window.location.href = '/profile'; 
    }
}

function handleReserve() {
    window.location.href = '/reservationPage';
}

function handleViewLabs() {
    window.location.href = '/slots';
}

// search function
document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("search");
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");

    searchForm.style.position = "relative";

    // dropdown
    Object.assign(searchResults.style, {
        position: "absolute",
        top: `${searchInput.offsetHeight}px`, 
        left: `${searchInput.offsetLeft}px`,
        width: `${searchInput.clientWidth}px`,
        zIndex: "1050",
        maxHeight: "200px",
        overflowY: "auto",
        display: "none", 
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "0",
        listStyleType: "none",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", 
    });

    searchInput.addEventListener("input", async () => {
        const query = searchInput.value.trim();
        if (!query) {
            searchResults.style.display = "none";
            return;
        }

        try {
            const response = await fetch(`/search?q=${query}`);
            const users = await response.json();

            searchResults.innerHTML = ""; 

            if (users.length > 0) {
                users.forEach(user => {
                    const listItem = document.createElement("li");
                    listItem.classList.add("dropdown-item");
                    listItem.textContent = `${user.firstName} ${user.lastName}`;
                    listItem.style.cursor = "pointer";
                    listItem.style.padding = "10px";
                    listItem.style.borderBottom = "1px solid #ddd";

                    listItem.addEventListener("mouseover", () => {
                        listItem.style.backgroundColor = "#f8f9fa";
                    });
                    listItem.addEventListener("mouseout", () => {
                        listItem.style.backgroundColor = "transparent";
                    });

                    // redirecting 
                    listItem.addEventListener("click", () => {
                        window.location.href = `/profile`;
                    });

                    searchResults.appendChild(listItem);
                });

                searchResults.style.display = "block"; 
            } else {
                searchResults.style.display = "none";
            }
        } catch (error) {
            console.error("Search error:", error);
        }
    });

    document.addEventListener("click", (event) => {
        if (!searchForm.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.style.display = "none";
        }
    });
});