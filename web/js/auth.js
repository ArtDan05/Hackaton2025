// js/auth.js

document.addEventListener('DOMContentLoaded', () => {
    const isAuth = localStorage.getItem('auth');
    const userRole = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    const usernameDisplayElement = document.getElementById('usernameDisplay');
    const logoutButton = document.getElementById('logoutButton');

    // 1. Проверка авторизации
    if (isAuth !== 'true' || !userRole || !username) {
        // Если нет авторизации, перенаправляем на страницу входа
        window.location.href = 'login.html';
        return;
    }

    // 2. Отображение имени пользователя
    if (usernameDisplayElement) {
        usernameDisplayElement.textContent = username;
    }

    // 3. Логика выхода
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Очищаем локальное хранилище
            localStorage.clear(); 
            window.location.href = 'login.html';
        });
    }

    // 4. Проверка прав доступа (Простая реализация)
    const requiredRole = document.body.getAttribute('data-role-required');
    if (requiredRole && requiredRole !== userRole) {
        alert(`Доступ запрещен. Требуется роль: ${requiredRole}. Ваша роль: ${userRole}.`);
        window.location.href = 'login.html'; // или другая страница
    }
});