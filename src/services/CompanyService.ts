'use strict';

import { DataSource } from 'typeorm';
import { Company } from '../db/entities/Company.entity';
import logger from '../utils/logger';

export default (DB: DataSource) => {
  const companyRepository = DB.getRepository(Company);

  return {
    find: (id: number) => companyRepository.findOne({ where: { id } }),
    get: () => companyRepository.find(),
    create: (payload: Partial<Company>) =>
      companyRepository.save(payload).catch((err: any) => {
        logger.error(`Failed to create company ${err}`);
        err.status = 500;
        throw err;
      }),
  };
};
