import { Request, Response, Router } from 'express';
import { Station } from '../../db/entities/Station.entity';
const router = Router();

export default function (stationService: any) {
  router.get('/', (_: Request, res: Response, next: any) => {
    return stationService
      .get()
      .then((stations: [Station]) => res.json(stations))
      .catch(next);
  });

  router.post('/', (req: Request, res: Response, next: any) => {
    const { name, companyId } = req.body;

    return stationService
      .create({ name, companyId, active: true })
      .then((newStation: Station) => res.status(201).json(newStation))
      .catch(next);
  });

  router.delete('/:id', (req: Request, res: Response, next: any) => {
    return stationService
      .delete(req.params.id)
      .then(() => res.status(200).json())
      .catch(next);
  });

  router.put('/:id', (req: Request, res: Response, next: any) => {
    const { name, companyId } = req.body;
    return stationService
      .update(req.params.id, { name, companyId })
      .then(() => res.status(200).json())
      .catch(next);
  });
  return router;
}
