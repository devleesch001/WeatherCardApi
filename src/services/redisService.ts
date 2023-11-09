import { createClient } from 'redis';
import config from '~/config';

const client = createClient({
    url: config.redis.url,
});

const init = async () => {
    client.on('error', (err) => console.log('Redis Client Error', err));
    client.on('end', (args) => console.log('Redis Client Error', args));

    await client.connect();
};

export default { client, init };
