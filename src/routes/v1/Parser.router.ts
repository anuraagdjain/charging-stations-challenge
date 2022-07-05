import { Request, Response, Router } from 'express';
const router = Router();

export default function (parserService: any) {
  router.post('/', async (req: Request, res: Response, next: any) => {
    const script = req.body;
    return parserService
      .convertScriptInputToInstruction(script)
      .then((instruction: Array<Object>) => res.json(instruction))
      .catch(next);
  });

  return router;
}
