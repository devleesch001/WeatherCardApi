import jwt, { Secret } from 'jsonwebtoken';
import { IUser } from '~/models/user';
import config from '~/config';

export const generateAccessToken = (user: IUser): string => {
    return jwt.sign({ email: user.email, username: user.username }, config.JWTokenSecret, {
        expiresIn: '24h',
    });
};
