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
    delete: async (id: number) => {
      const childCompanyCount = await companyRepository.countBy({ parentId: id });
      if (childCompanyCount > 0) {
        throw new Error('Cannot delete company as child comapnies exist!');
      }
      return companyRepository.delete(id).catch((err: any) => {
        logger.error(`Failed to delete company id ${id} - ${err}`);
        err.status = 500;
        throw err;
      });
    },
    update: (id: number, payload: Partial<Company>) =>
      companyRepository.update(id, payload).catch((err: any) => {
        logger.error(`Failed to update company ${err}`);
        err.status = 500;
        throw err;
      }),
  };
};
