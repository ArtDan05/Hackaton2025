const API_URL = "http://127.0.0.1:5000/api/login"; 

(function() {
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
    } else {
        body.classList.remove('light-theme');
    }
})();


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

            localStorage.setItem("auth", "true");
            localStorage.setItem("role", data.role);
            localStorage.setItem("user_id", data.user_id);
            localStorage.setItem("username", data.username);
            
            if (data.role === "admin") {
                window.location.href = "dashboard.html";
            } else if (data.role === "manager" || data.role === "user") { 
                window.location.href = "requests.html";
            } else {
                alert("Неизвестная роль. Вход отменен.");
            }
        } else {

            alert(data.message || "Ошибка авторизации");
        }
    } catch (error) {
        console.error('Ошибка сети:', error);
        alert("Не удалось подключиться к Backend-серверу.");
    }
});