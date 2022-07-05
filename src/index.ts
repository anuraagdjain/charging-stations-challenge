import express, { Express, Request, Response } from 'express';
import config from 'config';
import logger from './utils/logger';
import { MySqlDataSource } from './db';
import { DataSource } from 'typeorm';
import Services from './services';
import V1Routes from './routes/v1';

const app: Express = express();
const port = config.get('server.port');

app.use(express.json());
app.use(express.text());

app.get('/healthcheck', (req: Request, res: Response, next: any) => res.json({ time: new Date().getTime() }));

MySqlDataSource.initialize().then((DB: DataSource) => {
  logger.debug('Connected to database');

  const services = Services(DB);
  const v1Routes = V1Routes(services);

  app.use('/api/v1/companies', v1Routes.companyRouter);
  app.use('/api/v1/stations', v1Routes.stationRouter);
  app.use('/api/v1/station-types', v1Routes.stationTypeRouter);
  app.use('/api/v1/parser', v1Routes.parserRouter);

  app.use(function (err: any, req: Request, res: Response, next: any) {
    logger.error(`Fatal error ${err.message} - ${err.stack}`);
    if (err) return res.status(err.status || 500).json({ error: err.message });
    return next(err);
  });

  app.listen(port, () => {
    logger.info(`Server is running at https://localhost:${port}`);
  });
});
