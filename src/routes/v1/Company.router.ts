import { Request, Response, Router } from 'express';
import { Company } from '../../db/entities/Company.entity';
const router = Router();

export default function (companyService: any) {
  router.get('/', (_: Request, res: Response, next: any) => {
    return companyService
      .get()
      .then((companies: [Company]) => res.json(companies))
      .catch(next);
  });

  router.post('/', (req: Request, res: Response, next: any) => {
    const { name, parentId } = req.body;

    return companyService
      .update({ name, parentId, active: true })
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
  return router;
}
