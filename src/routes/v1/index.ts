import CompanyRouter from './Company.router';

export default function (services: any) {
  return {
    companyRouter: CompanyRouter(services.companyService),
  };
}
