// js/login.js

// js/login.js

const API_URL = "http://127.0.0.1:5000/api/login"; 

// ... остальная логика fetch и перенаправления ...

// --- Логика переключения темы (оставляем) ---
(function() {
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
    } else {
        body.classList.remove('light-theme');
    }
})();

// --- ЛОГИКА АВТОРИЗАЦИИ ЧЕРЕЗ API ---
document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok && data.success) { 
            // 1. Успешный вход: сохраняем данные
            localStorage.setItem("auth", "true");
            localStorage.setItem("role", data.role);
            localStorage.setItem("user_id", data.user_id);
            localStorage.setItem("username", data.username);
            
            // 2. Перенаправление
            if (data.role === "admin") {
                window.location.href = "dashboard.html";
            } else if (data.role === "manager" || data.role === "user") { // Проверяем и manager, и user
                window.location.href = "requests.html";
            } else {
                alert("Неизвестная роль. Вход отменен.");
            }
        } else {
            // Неуспешный вход (сообщение от app.py)
            alert(data.message || "Ошибка авторизации");
        }
    } catch (error) {
        console.error('Ошибка сети:', error);
        alert("Не удалось подключиться к Backend-серверу (Flask). Проверьте, запущен ли app.py на порту 5000.");
    }
});