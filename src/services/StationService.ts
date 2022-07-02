'use strict';

import { DataSource } from 'typeorm';
import { Station } from '../db/entities/Station.entity';
import logger from '../utils/logger';

export default (DB: DataSource) => {
  const stationRepository = DB.getRepository(Station);

  return {
    find: (id: number) => stationRepository.findOne({ where: { id } }),
    get: () => stationRepository.find(),
    create: (payload: Partial<Station>) =>
      stationRepository.save(payload).catch((err: any) => {
        logger.error(`Failed to station ${err}`);
        err.status = 500;
        throw err;
      }),
    delete: async (id: number) => {
      return stationRepository.delete(id).catch((err: any) => {
        logger.error(`Failed to delete station id ${id} - ${err}`);
        err.status = 500;
        throw err;
      });
    },
    update: (id: number, payload: Partial<Station>) =>
      stationRepository.update(id, payload).catch((err: any) => {
        logger.error(`Failed to update station ${err}`);
        err.status = 500;
        throw err;
      }),
  };
};
