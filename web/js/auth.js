document.addEventListener('DOMContentLoaded', () => {
    const isAuth = localStorage.getItem('auth');
    const userRole = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    const usernameDisplayElement = document.getElementById('usernameDisplay');
    const logoutButton = document.getElementById('logoutButton');

    if (isAuth !== 'true' || !userRole || !username) {

        window.location.href = 'login.html';
        return;
    }


    if (usernameDisplayElement) {
        usernameDisplayElement.textContent = username;
    }


    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('auth');
            localStorage.removeItem('role');
            localStorage.removeItem('username');
            window.location.href = 'login.html';
        });
    }

    const requiredRole = document.body.getAttribute('data-role-required');
    if (requiredRole && requiredRole !== userRole) {
        alert(`Доступ запрещен. Требуется роль: ${requiredRole}. Ваша роль: ${userRole}.`);
        window.location.href = 'login.html'; 
    }
});