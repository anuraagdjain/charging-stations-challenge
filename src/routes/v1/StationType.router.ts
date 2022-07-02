import { Request, Response, Router } from 'express';
import { StationType } from '../../db/entities/StationType.entity';
const router = Router();

export default function (stationTypeService: any) {
  router.get('/', (_: Request, res: Response, next: any) => {
    return stationTypeService
      .get()
      .then((stationTypes: [StationType]) => res.json(stationTypes))
      .catch(next);
  });

  router.post('/', (req: Request, res: Response, next: any) => {
    const { name, stationId, maxPower } = req.body;

    return stationTypeService
      .create({ name, stationId, maxPower })
      .then((newStationType: StationType) => res.status(201).json(newStationType))
      .catch(next);
  });

  router.delete('/:id', (req: Request, res: Response, next: any) => {
    return stationTypeService
      .delete(req.params.id)
      .then(() => res.status(200).json())
      .catch(next);
  });

  router.put('/:id', (req: Request, res: Response, next: any) => {
    const { name, maxPower, stationId } = req.body;
    return stationTypeService
      .update(req.params.id, { maxPower, stationId, name })
      .then((row: StationType) => res.status(200).json(row))
      .catch(next);
  });
  return router;
}
