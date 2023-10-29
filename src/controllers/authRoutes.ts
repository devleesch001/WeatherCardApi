import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { MongoError } from 'mongodb';

import { generateAccessToken } from '~/services/authenticationService';
import User from '~/models/user';
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
                res.status(201).json({ token: generateAccessToken(user) });
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

        return res.status(200).json({ token: generateAccessToken(user) });
    }
);

export default router;
