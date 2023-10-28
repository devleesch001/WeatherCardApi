import mongoose from 'mongoose';
import config from '~/config';

export const init = async () => {
    await mongoose.connect(config.mongo.url);
};

export default { init };
