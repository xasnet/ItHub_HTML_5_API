// config.mjs
import dotenv from 'dotenv';
dotenv.config();

const config = {
  PORT_WEATHER: process.env.PORT_WEATHER || 4000,
  API_KEY_WEATHER: process.env.API_KEY_WEATHER || '0afdf607-b08c-434c-ac11-fb9b3d5872fb',
  API_URL_WEATHER: process.env.API_URL_WEATHER || 'https://api.weather.yandex.ru/v2/forecast'
};

export default config;