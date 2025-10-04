const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const crypto = require('crypto');
// логи

const fs = require('fs');
const path = require('path');
const LOG_FILE = path.join(__dirname, 'app.log');
/**
 * функция для сохранения логов в файл
 * @param {string} action 
 * @param {string} user 
 * @param {string} [details=''] 
 */
function logAction(action, user, details = '') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [USER: ${user}] - ${action.toUpperCase()}${details ? ' | ' + details : ''}\n`;

    fs.appendFile(LOG_FILE, logEntry, (err) => {
        if (err) {
            console.error(`Ошибка записи лога в файл ${LOG_FILE}:`, err);
        }
    });
}

const app = express();
const PORT = 5000;
const DB_FILE = 'secrets.db'; 


app.use(cors()); 
app.use(express.json());

const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
        console.error(`Ошибка при открытии базы данных: ${err.message}`);
        return;
    }
    console.log(`Успешно подключено к базе данных SQLite: ${DB_FILE}`);
});

const md5Hash = (text) => {
    return crypto.createHash('md5').update(text).digest('hex');
};

const generateId = (prefix) => {
    return prefix + Date.now().toString(36) + Math.random().toString(36).substring(2, 6).toUpperCase();
};

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Не указан логин или пароль" });
    }


    const passwordHash = md5Hash(password);

    console.log(`\n--- ПОПЫТКА АВТОРИЗАЦИИ (Node.js) ---`);
    console.log(`Введенный логин: '${username}'`);
    console.log(`Сгенерированный MD5 хеш: '${passwordHash}'`);
    
    const sql = `
        SELECT UserID, Role, Username
        FROM Users 
        WHERE Username = ? AND PasswordHash = ?
    `;

    db.get(sql, [username, passwordHash], (err, row) => {
        if (err) {
            console.error(`Ошибка выполнения запроса: ${err.message}`);
            return res.status(500).json({ success: false, message: "Ошибка сервера базы данных" });
        }

        console.log(`Результат запроса (row): ${row ? 'Найден' : 'Не найден'}`);

        if (row) {

            const role = row.Role;
            const userId = row.UserID;
            const fetchedUsername = row.Username; 
            const roleForFrontend = (role === 'admin' || role === 'manager') ? role : 'manager';
            logAction('Успешная Авторизация', row.Username, `Роль: ${role}`);

            return res.json({
                success: true,
                role: role,
                user_id: userId,
                username: fetchedUsername, 
                message: "Авторизация успешна"
            });
        } else {
            logAction('Ошибка Авторизации', username, `Неверный логин или пароль`);
            return res.status(401).json({ success: false, message: "Неверный логин или пароль" });
        }
    });
});
app.get('/api/requests', (req, res) => {
    const sql = `
        SELECT 
            ID, 
            Login, 
            Resource, 
            Reason, 
            Status, 
            DateTime 
        FROM Requests 
        ORDER BY ID DESC;
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(`Ошибка при получении заявок: ${err.message}`);
            return res.status(500).json({ success: false, message: "Ошибка сервера БД" });
        }
        res.json({ success: true, requests: rows });
    });
});

app.post('/api/requests/update-status', (req, res) => {
    const { id, status, approverLogin } = req.body; 
    const userForLog = approverLogin

    if (!id || !status || (status !== 'approved' && status !== 'rejected')) {
        logAction('Ошибка Модерации Заявки', userForLog, `Неверные данные: ID=${id}, Status=${status}`);
        return res.status(400).json({ success: false, message: "Неверные данные для обновления статуса." });
    }
    
    const sql = `
        UPDATE Requests 
        SET Status = ?
        WHERE ID = ? AND Status = 'pending'
    `;

    db.run(sql, [status, id], function(err) {
        if (err) {
            console.error(`Ошибка при обновлении статуса: ${err.message}`);
            return res.status(500).json({ success: false, message: "Ошибка сервера БД" });
        }
        
        if (this.changes > 0) {
            res.json({ success: true, message: `Заявка ${id} обновлена до ${status}.` });
            logAction(`Заявка ${status.toUpperCase()}`, userForLog, `ID: ${id}`);
            
        } else {
            res.status(404).json({ success: false, message: "Заявка не найдена или ее статус уже изменен." });
        }
    });
});

app.post('/api/requests/submit', (req, res) => {
    const { 
        resource,
        reason, 
        login, 
        untilDate
    } = req.body;

    if (!resource || !reason || !login) {
        return res.status(400).json({ success: false, message: "Не все обязательные поля заполнены." });
    }

    const requestID = generateId('REQ');
    const status = 'pending'; 
    const submissionDateTime = new Date().toISOString(); 

    const sql = `
        INSERT INTO Requests (ID, Login, Resource, Reason, Status, DateTime)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [
        requestID,
        login, 
        resource,
        reason,
        status,
        untilDate
    ];

    db.run(sql, params, function(err) {
        if (err) {
            console.error(`Ошибка при создании заявки: ${err.message}`);
            return res.status(500).json({ success: false, message: "Ошибка сервера БД при сохранении заявки." });
        }
        logAction('Отправка заявки', login, `ID: ${requestID}, Ресурс: ${resource}`);
        console.log(`Создана новая заявка: ${requestID}`);
        res.json({ success: true, message: `Заявка успешно отправлена на рассмотрение. ID: ${requestID}` });
    });
});
app.listen(PORT, () => {
    console.log(`✅ Backend API запущен на http://localhost:${PORT}`);
    console.log(`-----------------------------------------------`);
});