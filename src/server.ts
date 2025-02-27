import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
// CRON JOBS
import './jobs/CronJob';

// ROUTERS
import { router as UserRouter } from './routes/UserRoutes';
import { router as LoginRouter } from './routes/AuthRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// CORS configuration
const corsOptions = {
  origin: true,
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.send(`Hello from the SlipSam API, currently running on port: ${port}`);
});

app.use('/api/auth', LoginRouter);
app.use('/api/user', UserRouter);

app.listen(port, () => {
  console.log(`Server running on port:${port}`);
});