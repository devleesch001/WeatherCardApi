import { Router } from 'express';
import { toLower } from 'lodash';
import RedisService from '~/services/redisService';
import openWeatherMapService from '~/services/openWeatherMapService';
import { query, validationResult } from 'express-validator';

const router = Router();

router.get('', query('search').isString(), async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(400).json({ errors: error.array() });

    const search = toLower(req.query?.search as string);

    const result = await RedisService.client.get(`_search-${search}`);

    // if found in cache return result
    if (typeof result === 'string' && result.length > 0) {
        return res.status(200).json(JSON.parse(result));
    }

    const response = await openWeatherMapService.getGeocode(search);

    // if error from openWeatherMapService return service unavailable
    if (response.status !== 200) {
        return res.status(response.status).json({ message: 'service unavailable' });
    }

    // if not found return not found
    if (response.data.length === 0) {
        return res.status(404).json({ message: 'not found' });
    }

    response.data = openWeatherMapService.filter(response.data);

    // insert in cache
    await RedisService.client.set(`_search-${search}`, JSON.stringify(response.data), {
        EX: 86400, // 1 day in secondes
        NX: true,
    });

    return res.status(200).json(response.data);
});

export default router;
