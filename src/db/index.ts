import { DataSource } from 'typeorm';
import databaseConnection from './config';

export const MySqlDataSource = new DataSource(databaseConnection);
