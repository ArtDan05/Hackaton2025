// server.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const crypto = require('crypto'); // Для MD5 хеширования

const app = express();
const PORT = 5000;
const DB_FILE = 'secrets.db'; // Файл БД должен лежать рядом с server.js

// --- Настройка Express ---
app.use(cors()); // Разрешаем запросы с других портов (с нашего frontend)
app.use(express.json()); // Позволяет читать JSON из тела запроса

// --- Подключение к базе данных ---
const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
        console.error(`Ошибка при открытии базы данных: ${err.message}`);
        return;
    }
    console.log(`Успешно подключено к базе данных SQLite: ${DB_FILE}`);
});

// Функция MD5 хеширования
const md5Hash = (text) => {
    return crypto.createHash('md5').update(text).digest('hex');
};

// --- API Endpoint для авторизации ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Не указан логин или пароль" });
    }

    // 1. Хеширование пароля MD5
    const passwordHash = md5Hash(password);

    console.log(`\n--- ПОПЫТКА АВТОРИЗАЦИИ (Node.js) ---`);
    console.log(`Введенный логин: '${username}'`);
    console.log(`Сгенерированный MD5 хеш: '${passwordHash}'`);
    
    // 2. SQL Запрос
    // Используем TRIM() и UCASE() для повышения надежности, т.к. вы уверены в данных.
    // ВАЖНО: SQLite по умолчанию нечувствителен к регистру для TEXT, но TRIM помогает.
    const sql = `
        SELECT UserID, Role, Username
        FROM Users 
        WHERE Username = ? AND PasswordHash = ?
    `;

    // 3. Выполнение запроса
    db.get(sql, [username, passwordHash], (err, row) => {
        if (err) {
            console.error(`Ошибка выполнения запроса: ${err.message}`);
            return res.status(500).json({ success: false, message: "Ошибка сервера базы данных" });
        }

        console.log(`Результат запроса (row): ${row ? 'Найден' : 'Не найден'}`);

        if (row) {
            // Успешный вход
            const role = row.Role;
            const userId = row.UserID;
            const fetchedUsername = row.Username; // <-- ДОБАВЛЕНО: Теперь мы его извлекаем!

            // Перенаправление (Frontend ожидает 'admin' или 'manager')
            const roleForFrontend = (role === 'admin' || role === 'manager') ? role : 'manager';

            return res.json({
                success: true,
                role: role,
                user_id: userId,
                username: fetchedUsername, 
                message: "Авторизация успешна"
            });
        } else {
            // Неверный логин или пароль
            return res.status(401).json({ success: false, message: "Неверный логин или пароль" });
        }
    });
});

// --- Запуск сервера ---
app.listen(PORT, () => {
    console.log(`✅ Backend API запущен на http://localhost:${PORT}`);
    console.log(`-----------------------------------------------`);
});