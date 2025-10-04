
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


if (localStorage.getItem("auth") !== "true") {
    window.location.href = "login.html";
}

const requests = [
    {id: "1", resource: "Prod DB", reason: "Для отчета", until: "2025-10-05", status: "pending"},
    {id: "2", resource: "VPN", reason: "Удаленка", until: "2025-10-06", status: "approved"},
    {id: "3", resource: "Azure Creds", reason: "Новый проект", until: "2025-11-01", status: "pending"},
];

function renderRequests() {
    const tbody = document.getElementById("requestsTable");
    tbody.innerHTML = "";
    requests.forEach(r => {
        const tr = document.createElement("tr");
        let statusClass = '';
        if (r.status === 'pending') {
            statusClass = 'status-pending';
        } else if (r.status === 'approved') {
            statusClass = 'status-approved';
        }

        tr.innerHTML = `
            <td>${r.id}</td>
            <td>${r.resource}</td>
            <td>${r.reason}</td>
            <td>${r.until}</td>
            <td><span class="status-badge ${statusClass}">${r.status}</span></td>
            <td>
                ${r.status === "pending" 
                    ? `<button class="btn btn-action" onclick="approve('${r.id}')">Approve</button>` 
                    : "—"}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function approve(id) {
    const req = requests.find(r => r.id === id);
    if (req) {
        req.status = "approved";
        renderRequests();
    }
}

function logout() {
    localStorage.removeItem("auth");

    window.location.href = "login.html";
}

renderRequests();