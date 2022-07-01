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
      .create({ name, parentId, active: true })
      .then((newCompany: Company) => res.json(newCompany).status(201))
      .catch(next);
  });
  return router;
}
