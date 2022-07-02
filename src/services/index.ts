'use strict';
import { DataSource } from 'typeorm';
import CompanyService from './CompanyService';
import StationService from './StationService';
import StationTypeService from './StationTypeService';

export default (DB: DataSource) => {
  return {
    companyService: CompanyService(DB),
    stationService: StationService(DB),
    stationTypeService: StationTypeService(DB),
  };
};
