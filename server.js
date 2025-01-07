const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const xml2js = require('xml2js');
const dotenv = require('dotenv').config(); // Инициализация dotenv

if (dotenv.error) {
    console.log(`Ошибка загрузки настроек .env`);
    throw dotenv.error;
}

// Получаем настройки из переменных окружения
const port = process.env.PORT_NEWS || 5000;
const url_news = process.env.API_URL_NEWS || 'https://lenta.ru/rss/news/russia';
const count_news = process.env.COUNT_NEWS || 5;

// Создаем HTTP-сервер
const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end('Ошибка загрузки файла');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
});

// Создаем WebSocket-сервер, подключая его к нашему HTTP-серверу
const wss = new WebSocket.Server({ server });

let latestNews = [];

// Функция для запроса новостей
async function fetchLatestNews() {
    try {
        // Запрашиваем новости
        const response = await axios.get(`${url_news}`);

        // Парсим XML-данные
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(response.data);

        // Извлекаем последние новости
        latestNews = result.rss.channel[0].item.slice(0, count_news).map(item => ({
            title: item.title[0],
            link: item.link[0],
            pubDate: item.pubDate[0]
        }));

        console.log('Новости обновлены:', latestNews);
    } catch (error) {
        console.error('Ошибка получения новостей:', error);
    }
}

// Отправка новостей всем подключенным клиентам
function broadcastNews() {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(latestNews));
        }
    });
}

// Периодическое обновление новостей
setInterval(async () => {
    await fetchLatestNews();
    broadcastNews();
}, 30000); // Каждые 30 секунд

// Обработчик подключения клиента WebSocket
wss.on('connection', ws => {
    console.log('Клиент подключен');

    // Отправляем последние новости при подключении
    ws.send(JSON.stringify(latestNews));

    ws.on('error', (error) => {
        console.error('Ошибка WebSocket:', error);
    });
});

// Запускаем HTTP-сервер на порту ${port}
server.listen(port, () => {
    console.log(`Сервер HTTP запущен на http://localhost:${port}`);
});