import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

export default {
    port: process.env.PORT || 8080,
    mongo: {
        url: process.env.MANGODB_URL ?? 'mongodb://',
    },
};
