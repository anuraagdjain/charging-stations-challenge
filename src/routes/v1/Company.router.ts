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
  return router;
}
