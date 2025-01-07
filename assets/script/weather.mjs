import express from 'express';
import cors from 'cors';
import config from './config.mjs'; // Импортируем конфигурацию
import weatherRouter from './routes/weather.mjs'; // Импорт маршрутов

const app = express();

// Подключение CORS
app.use(cors());

// Маршрутизация
app.use('/weather', weatherRouter);

// Глобальная обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: err.message });
});

// Создаем HTTP-сервер
const server = app.listen(config.PORT_WEATHER, () => {
  console.log(`HTTP-сервер запущен на http://localhost:${config.PORT_WEATHER}`);
});
