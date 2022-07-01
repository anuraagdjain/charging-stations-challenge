'use strict';
import { DataSource } from 'typeorm';
import CompanyService from './CompanyService';

export default (DB: DataSource) => {
  return {
    companyService: CompanyService(DB),
  };
};
