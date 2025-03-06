function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true'; // Check for "true"
}

function handleProfile() {
    if (!isLoggedIn()) {
        window.location.href = '/login';  // Redirect to login page
    } else {
        window.location.href = '/profile';  // Redirect to profile page
    }
}
