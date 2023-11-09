import { Router } from 'express';
import authRoutes from '~/controllers/authRoutes';
import weatherRoutes from '~/controllers/weatherRoutes';
import geocodeRoutes from '~/controllers/geocodeRoutes';

const apiV2Router = Router();
apiV2Router.use('/auth', authRoutes);
apiV2Router.use('/weather', weatherRoutes);
apiV2Router.use('/geocode', geocodeRoutes);
apiV2Router.get('/ping', async (req, res) => {
    return res.status(200).json({ ping: 'pong' });
});

const router = Router();
router.use('/api/v2', apiV2Router);

export default router;
