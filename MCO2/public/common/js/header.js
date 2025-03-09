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