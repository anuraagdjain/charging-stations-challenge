'use strict';
import { DataSource } from 'typeorm';
import CompanyService from './CompanyService';
import StationService from './StationService';

export default (DB: DataSource) => {
  return {
    companyService: CompanyService(DB),
    stationService: StationService(DB),
  };
};
