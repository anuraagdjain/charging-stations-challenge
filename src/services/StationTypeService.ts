'use strict';

import { DataSource } from 'typeorm';
import { StationType } from '../db/entities/StationType.entity';
import logger from '../utils/logger';

export default (DB: DataSource) => {
  const stationTypeRepository = DB.getRepository(StationType);

  return {
    find: (id: number) => stationTypeRepository.findOne({ where: { id } }),
    get: () => stationTypeRepository.find(),
    create: (payload: Partial<StationType>) =>
      stationTypeRepository.save(payload).catch((err: any) => {
        logger.error(`Failed to save station-type ${err}`);
        err.status = 500;
        throw err;
      }),
    delete: async (id: number) => {
      return stationTypeRepository.delete(id).catch((err: any) => {
        logger.error(`Failed to delete station-type id ${id} - ${err}`);
        err.status = 500;
        throw err;
      });
    },
    update: (id: number, payload: Partial<StationType>) =>
      stationTypeRepository
        .update(id, payload)
        .then(() => stationTypeRepository.findOne({ where: { id } }))
        .catch((err: any) => {
          logger.error(`Failed to update station-type ${err}`);
          err.status = 500;
          throw err;
        }),
  };
};
