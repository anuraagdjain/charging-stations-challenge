import { Request, Response, Router } from 'express';
import { In } from 'typeorm';
import { Company } from '../../db/entities/Company.entity';
import { Station } from '../../db/entities/Station.entity';
const router = Router();

export default function (companyService: any, stationService: any) {
  router.get('/', (_: Request, res: Response, next: any) => {
    return companyService
      .get()
      .then((companies: [Company]) => res.json(companies))
      .catch(next);
  });

  router.post('/', (req: Request, res: Response, next: any) => {
    const { name, parentId } = req.body;

    return companyService
      .create({ name, parentId, active: true })
      .then((newCompany: Company) => res.status(201).json(newCompany))
      .catch(next);
  });

  router.delete('/:id', (req: Request, res: Response, next: any) => {
    return companyService
      .delete(req.params.id)
      .then(() => res.status(200).json())
      .catch(next);
  });

  router.put('/:id', (req: Request, res: Response, next: any) => {
    const { name, parentId } = req.body;
    return companyService
      .update(req.params.id, { name, parentId })
      .then(() => res.status(200).json())
      .catch(next);
  });

  router.get('/:id/stations', (req: Request, res: Response, next: any) => {
    return companyService
      .findWithChildrens(req.params.id)
      .then(async (companies: [Company]) => {
        const companyIds = companies.map((company) => company.id);
        const stations = await stationService.findWithStationType({ where: { companyId: In(companyIds) } });
        const payload = stations.reduce((arr: [any], station: Station) => {
          const obj = {
            stationId: station.id,
            stationName: station.name,
            maxPower: station.stationType?.maxPower ?? null,
          };
          arr.push(obj);
          return arr;
        }, []);
        return res.json(payload);
      })
      .catch(next);
  });
  return router;
}
