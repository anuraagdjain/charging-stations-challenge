import CompanyRouter from './Company.router';
import ParserRouter from './Parser.router';
import StationRouter from './Station.router';
import StationTypeRouter from './StationType.router';

export default function (services: any) {
  return {
    companyRouter: CompanyRouter(services.companyService, services.stationService),
    stationRouter: StationRouter(services.stationService),
    stationTypeRouter: StationTypeRouter(services.stationTypeService),
    parserRouter: ParserRouter(services.parserService),
  };
}
