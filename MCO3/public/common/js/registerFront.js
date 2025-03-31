document.addEventListener('DOMContentLoaded', function () {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const registerBtn = document.getElementById('registerBtn');

    function validateEmail() {
        const emailError = document.getElementById('emailError');
        if (!email.value.endsWith('@dlsu.edu.ph')) {
            emailError.textContent = 'Email must be a DLSU email.';
            return false;
        }
        emailError.textContent = '';
        return true;
    }

    function validatePassword() {
        const passwordError = document.getElementById('passwordError');
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        if (!regex.test(password.value)) {
            passwordError.textContent = 'Password must be at least 8 characters with a number, uppercase letter, and special character.';
            return false;
        }
        passwordError.textContent = '';
        return true;
    }

    function matchPasswords() {
        const confirmPasswordError = document.getElementById('confirmPasswordError');
        if (password.value !== confirmPassword.value) {
            confirmPasswordError.textContent = 'Passwords do not match.';
            return false;
        }
        confirmPasswordError.textContent = '';
        return true;
    }

    function validateForm() {
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isMatch = matchPasswords();
        registerBtn.disabled = !(isEmailValid && isPasswordValid && isMatch);
    }

    email.addEventListener('input', validateForm);
    password.addEventListener('input', validateForm);
    confirmPassword.addEventListener('input', validateForm);

    // sending data to backend
    const form = document.getElementById('registerForm');

    form.addEventListener('submit', async function (event) {

        const role = document.getElementById('role').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log("Sending request to /register with:", { role, firstName, lastName, email, password });

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role, firstName, lastName, email, password })
            });

            const result = await response.text();
            console.log("Server Response:", result);
            alert(result);
        } catch (error) {
            console.error("Error in fetch:", error);
        }
    });
}); 