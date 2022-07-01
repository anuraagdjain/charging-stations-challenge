interface DBConfig {
  host: string;
  port: number;
  user: string;
  password: string;
}

import config from 'config';
import { DataSourceOptions } from 'typeorm';
const dbConfig: DBConfig = config.get('database');

const databaseConnection: DataSourceOptions = {
  type: 'mysql',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.user,
  password: dbConfig.password,
  database: 'virta',
  entities: [__dirname + '/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*.ts'],
  multipleStatements: true,
  logging: false,
};

export default databaseConnection;
