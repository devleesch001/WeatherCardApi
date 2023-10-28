import { Router } from 'express';
import User from '~/models/user';
// import { generateAccessToken } from '~/services/AuthenticationService';
import { body, validationResult } from 'express-validator';
import { MongoError } from 'mongodb';
import { constants } from '~/config';

const router = Router();

router.post(
    '/register',
    body('username').isLength(constants.username),
    body('email').isLength(constants.email).isEmail(),
    body('password').isLength(constants.password),
    async (req, res) => {
        // Validate request
        const error = validationResult(req);
        if (!error.isEmpty()) return res.status(400).json({ errors: error.array() });

        // Create user
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            favorites: [],
        });

        // Save user
        user.save()
            .then(() => {
                res.status(201).json({ user: user.serialize() });
            })
            .catch((err: MongoError) => {
                if (err.code === 11000) {
                    return res.status(400).json({ code: 400, message: 'User already exists' });
                }

                res.status(500).json({ code: 500, message: err.message });
            });
    }
);

router.post(
    '/login',
    body('email').isLength(constants.email).isEmail(),
    body('password').isLength(constants.password),
    async (req, res) => {
        // Validate request
        const error = validationResult(req);
        if (!error.isEmpty()) return res.status(400).json({ errors: error.array() });

        // Find user
        const user = await User.findOne({ email: req.body.email });

        if (!user) return res.status(400).json({ code: 400, message: 'User does not exist' });

        // Compare password
        if (!user.comparePassword(req.body.password))
            setTimeout(() => {
                return res.status(400).json({ code: 400, message: 'Wrong password' });
            }, 3000);

        return res.status(200).json({ user: user.serialize() });
    }
);

router.post('/test', (req, res) => {
    console.log('test');
    const user = new User({
        username: 'AAAA',
        email: 'alexis@AAAA.fr',
        password: 'test',
        favorites: [],
        hashedPassword: 'aa',
    });

    user.save()
        .then(() => {
            res.status(201).send({ user: 'ok' });
        })
        .catch((err: Error) => {
            res.status(500).send({ code: 500, message: err.message });
        });
});

export default router;
