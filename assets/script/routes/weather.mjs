import express from 'express';
import fetch from 'node-fetch';
import config from '../config.mjs'; // Импортируем конфигурацию

const router = express.Router();

/**
 * @typedef WeatherResponse
 * @property {string} error
 */

/**
 * @param {object} req
 * @param {object} res
 * @returns {Promise<WeatherResponse>}
 */
router.get('/', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Необходимо указать параметры "lat" и "lon"' });
  }

  try {
    const apiUrl = `${config.API_URL_WEATHER}?lat=${lat}&lon=${lon}&lang=ru_RU`;
    const response = await fetch(apiUrl, {
      headers: {
        'X-Yandex-API-Key': config.API_KEY_WEATHER,
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка при получении данных от Яндекс.Погоды: ${response.statusText}`);
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error("Ошибка при получении данных от Яндекс.Погоды:", error.message);
    return res.status(500).json({ error: 'Не удалось получить данные от Яндекс.Погоды' });
  }
});

export default router;