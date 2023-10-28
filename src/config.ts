import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

export const constants = {
    saltRounds: 13,
    username: {
        min: 3,
        max: 64,
    },
    email: {
        min: 3,
        max: 64,
    },
    password: {
        min: 8,
        max: 128,
    },
};

export default {
    port: process.env.PORT || '8080',
    mongo: {
        url: process.env.MANGODB_URL ?? 'mongodb://root:example@localhost:27017/',
    },
};
