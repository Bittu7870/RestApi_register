import express from 'express';
import { APP_PORT } from './config';
import router from './routes';
import errorHandler from './middlewares/errorHandler';

const app = express()
app.use(express.json())
app.use('/api', router);

app.use(errorHandler);
app.listen(APP_PORT, () => console.log(`Server running on Port: ${APP_PORT}`));