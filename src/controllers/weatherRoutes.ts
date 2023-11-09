import { Router } from 'express';
import cache from '~/services/cache';
import axios from 'axios';
import config from '~/config';
import { query, validationResult } from 'express-validator';
import RedisService from '~/services/redisService';
import openWeatherMapService from '~/services/openWeatherMapService';

const router = Router();

router.get('', query('lat').isNumeric(), query('lon').isNumeric(), async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(400).json({ errors: error.array() });

    const pos = { lat: req.query?.lat as string, lon: req.query?.lon as string };

    const weather = await RedisService.client.get(`_location-${pos.lat}.${pos.lon}`);

    if (typeof weather === 'string' && weather.length > 0) {
        return res.status(200).json(JSON.parse(weather));
    }

    const result = await openWeatherMapService.getWeather(pos.lat, pos.lon);

    if (result.status !== 200) {
        return res.status(result.status).json({ message: 'service unavailable' });
    }

    await RedisService.client.set(`_location-${pos.lat}.${pos.lon}`, JSON.stringify(result.data), {
        EX: 60, // 1 minute in secondes
        NX: true,
    });

    return res.status(200).json(result.data);
});
export default router;
