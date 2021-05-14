import 'reflect-metadata';
import express from 'express';
import cors from 'cors';

import errorMiddleware from './middlewares/error';
import bodyParser from './middlewares/bodyParser';
import router from './routes';

const app = express();

app.use(bodyParser());
app.use(cors());

app.use(router);
app.use(errorMiddleware);

export default app;
