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

const auth = localStorage.getItem("auth");
const role = localStorage.getItem("role");

if (auth !== "true" || role !== "user") {
    window.location.href = "login.html";
}

function logout() {
    localStorage.removeItem("auth");

    window.location.href = "login.html";
}


document.getElementById("requestForm").addEventListener("submit", function(e) {
    e.preventDefault();

    
    alert("Заявка успешно отправлена! Ожидайте согласования.");

    document.getElementById("requestForm").reset();
});