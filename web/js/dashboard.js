const API_BASE_URL = "http://127.0.0.1:5000/api/requests";
const tbody = document.getElementById("requestsTable");

// переключение темы
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


/**
 * рендерит данные в таблицу
 * @param {Array} requests 
 */
function renderRequests(requests) {
    tbody.innerHTML = "";
    
    if (requests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Активных заявок нет.</td></tr>';
        return;
    }

    requests.forEach(r => {
        const tr = document.createElement("tr");
        
        let statusClass = '';
        if (r.Status === 'pending') {
            statusClass = 'status-pending';
        } else if (r.Status === 'approved') {
            statusClass = 'status-approved';
        } else if (r.Status === 'rejected') {
            statusClass = 'status-rejected'; 
        }

        tr.innerHTML = `
            <td>${r.ID}</td>
            <td>${r.Resource}</td>
            <td>${r.Reason}</td>
            <td>${r.Login || '—'}</td>
            <td>${r.DateTime || '—'}</td> <td><span class="status-badge ${statusClass}">${r.Status}</span></td>
            <td>
                ${r.Status === "pending" 
                    ? `
                        <div class="action-buttons">
                            <button class="btn btn-action btn-approve" onclick="updateStatus('${r.ID}', 'approved')">Принять</button>
                            <button class="btn btn-action btn-reject" onclick="updateStatus('${r.ID}', 'rejected')">Отклонить</button>
                        </div>
                    ` 
                    : "—"}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function fetchRequests() {
    try {
        const response = await fetch(API_BASE_URL);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            renderRequests(data.requests);
        } else {
            console.error("Ошибка загрузки заявок:", data.message);
            alert("Ошибка загрузки заявок: " + (data.message || "Неизвестная ошибка"));
        }
    } catch (error) {
        console.error('Ошибка сети:', error);
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: red; padding: 20px;">Не удалось подключиться к Backend-серверу (Node.js).</td></tr>';
    }
}

/**
 * отправляет запрос на изменение статуса
 * @param {string} id 
 * @param {string} status 
 */
async function updateStatus(id, status) {
    const actionText = status === 'approved' ? 'ПРИНЯТЬ' : 'ОТКЛОНИТЬ';
    if (!confirm(`Вы уверены, что хотите ${actionText} заявку ${id}?`)) {
        return;
    }
    const approverLogin = localStorage.getItem("username"); 
    if (!approverLogin) {
        alert("Ошибка: Не удалось получить логин администратора.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/update-status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status, approverLogin}) 
        });
        
        const data = await response.json();

        if (response.ok && data.success) {
            console.log(data.message);
            fetchRequests(); 
        } else {
            alert("Ошибка: " + (data.message || "Не удалось изменить статус."));
        }
    } catch (error) {
        console.error('Ошибка сети:', error);
        alert("Ошибка связи с сервером при обновлении статуса.");
    }
}


// запускаем загрузку данных при полной загрузке DOM
document.addEventListener('DOMContentLoaded', fetchRequests);