import express, { Express, Request, Response } from 'express';
import config from 'config';
import logger from './utils/logger';
import { MySqlDataSource } from './db';
import { DataSource } from 'typeorm';
import Services from './services';
import V1Routes from './routes/v1';

const app: Express = express();
const port = config.get('server.port');

app.get('/healthcheck', (req: Request, res: Response, next: any) => {
  next(new Error('test'));
});

MySqlDataSource.initialize().then((DB: DataSource) => {
  logger.debug('Connected to database');

  const services = Services(DB);
  const v1Routes = V1Routes(services);

  app.use('/api/v1/companies', v1Routes.companyRouter);

  app.use(function (err: any, req: Request, res: Response, next: any) {
    logger.error(`Fatal error ${err.message} - ${err.stack}`);
    if (err) return res.json({ error: err.message }).status(err.status || 500);
    return next(err);
  });

  app.listen(port, () => {
    logger.info(`Server is running at https://localhost:${port}`);
  });
});
