'use strict';
import { DataSource } from 'typeorm';
import CompanyService from './CompanyService';
import ParserService from './ParserService';
import StationService from './StationService';
import StationTypeService from './StationTypeService';

export default (DB: DataSource) => {
  const companyService = CompanyService(DB);
  const stationService = StationService(DB);
  return {
    companyService,
    stationService,
    stationTypeService: StationTypeService(DB),
    parserService: ParserService({ companyService, stationService }),
  };
};
