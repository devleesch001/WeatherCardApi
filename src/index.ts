import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import config from '~/config';
import mongodbService from '~/services/mongodbService';

import indexRoutes from '~/controllers/index';

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongodbService
    .init()
    .then(() => console.log('connected to mongodb'))
    .catch((err) => console.log('mongodb connection error', err));

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.use('/', indexRoutes);

app.listen(config.port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${config.port}`);
});
