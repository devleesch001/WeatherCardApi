import { Router } from 'express';
import User from '~/models/user';
// import { generateAccessToken } from '~/services/AuthenticationService';
import { body, validationResult } from 'express-validator';

const router = Router();

/**
 * @openapi
 * /api/auth/login:
 *  post:
 *      description: login route!
 *      responses:
 *          401:
 *              description: "{message: 'invalid credentials'}"
 *          200:
 *              description: "{token: 'accessToken'}"
 */
router.post(
    '/login',
    body('email').isEmail().isLength({ min: 5, max: 128 }),
    body('password').isLength({ min: 5, max: 128 }),
    async (req, res) => {
        const user = await User.findOne(req.body.email);

        if (!user) {
            res.status(401).send({ message: 'invalid credentials' });
            return;
        }

        const password = req.body['password'];

        if (!(await user.checkPassword(password))) {
            res.status(401).send({ message: 'invalid credentials' });
            return;
        }

        console.log(user);

        // const accessToken = generateAccessToken(user.toUserInformation());
        res.send({
            token: 'accessToken',
        });
    }
);

/**
 * @openapi
 * /api/auth/register:
 *  post:
 *      description: Register route use for user want to be created an account!
 *      responses:
 *          200:
 *              description: Returns status of api
 */
router.post(
    '/register',
    body('email').isEmail().isLength({ min: 5, max: 128 }),
    body('username').isLength({ min: 3, max: 128 }),
    body('password').isLength({ min: 6, max: 128 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = new User({
            username: req.body.username,
            email: req.body.email,
        });

        await user.setPassword(req.body.password);

        user.save()
            .then(() => {
                // const accessToken = generateAccessToken(user.toUserInformation());

                res.status(201).send({ user: user.toUserInformation(), token: 'accessToken' });
            })
            .catch(() => {
                res.status(500);
                res.send({ message: 'failed' });
            });
    }
);
export default router;
