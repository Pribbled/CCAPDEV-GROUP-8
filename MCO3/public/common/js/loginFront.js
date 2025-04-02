document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginBtn = document.getElementById('loginBtn');
    
    function validateForm() {
        if (emailInput.value.trim() !== "" && passwordInput.value.trim() !== "") {
            loginBtn.removeAttribute("disabled");
        } else {
            loginBtn.setAttribute("disabled", "true");
        }
    }

    emailInput.addEventListener("input", validateForm);
    passwordInput.addEventListener("input", validateForm);

    // sending stuff to backend
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login successful! Redirecting...");
                window.location.href = "/";
            } else {
                alert(data.message || "Invalid login credentials");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Something went wrong. Please try again.");
        }
    });
})