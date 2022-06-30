import express, { Express, Request, Response } from 'express';
import winston from 'winston';
import config from 'config';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

const app: Express = express();
const port = config.get('server.port');

app.get('/healthcheck', (req: Request, res: Response) => res.json({ time: new Date().getTime() }));

app.listen(port, () => {
  logger.info(`Server is running at https://localhost:${port}`);
});
