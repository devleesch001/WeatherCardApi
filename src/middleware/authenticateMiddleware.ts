import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import config from '~/config';

export const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).send({ message: 'Please authenticate' });
        }

        (req as Request).token = jwt.verify(token, config.JWTokenSecret);

        next();
    } catch (err) {
        res.status(401).json({ message: 'Please authenticate' });
    }
};
