import CompanyRouter from './Company.router';
import StationRouter from './Station.router';

export default function (services: any) {
  return {
    companyRouter: CompanyRouter(services.companyService),
    stationRouter: StationRouter(services.stationService),
  };
}
