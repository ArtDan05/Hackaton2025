const API_SUBMIT_URL = "http://127.0.0.1:5000/api/requests/submit";
const requestForm = document.getElementById("requestForm");

const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

function applyTheme(theme) {
    if (theme === 'light') {
        body.classList.add('light-theme');
        sunIcon.style.display = 'inline-block';
        moonIcon.style.display = 'none';
    } else {
        body.classList.remove('light-theme');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'inline-block';
    }
}

const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
});


requestForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const login = localStorage.getItem("username");
    if (!login) {
        alert("Ошибка: Логин пользователя не найден. Перезайдите в систему.");
        window.location.href = "login.html";
        return;
    }

    const resource = document.getElementById("resource").value; 
    const reason = document.getElementById("reason").value;
    const untilDate = document.getElementById("untilDate").value;

    const requestData = {
        resource,
        reason,
        login,
        untilDate
    };

    // отправка данных на сервер
    try {
        const response = await fetch(API_SUBMIT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Ошибка сервера (RAW):', errorText);
            alert(`Ошибка отправки заявки. Статус: ${response.status}. Проверьте консоль.`);
            return;
        }

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            requestForm.reset();
        } else {
            console.error("Ошибка Backend-логики:", data.message);
            alert("Ошибка отправки заявки: " + (data.message || "Неизвестная ошибка Backend."));
        }

    } catch (error) {
        console.error('Критическая ошибка сети или парсинга:', error);
        alert("Не удалось отправить заявку. Проверьте, запущен ли Node.js Backend и консоль.");
    }
});
