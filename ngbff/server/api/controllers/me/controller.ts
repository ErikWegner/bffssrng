import { Request, Response } from 'express';
import l from '../../../common/logger';

export class Controller {
  me(req: Request, res: Response): void {
    if (!req.user) {
      res.status(401).send('Unauthorized').end();
      return;
    }

    l.info({ user: req.user }, 'user');
    const username = req.user?.name;
    res.json('Welcome, ' + username);
  }
}
export default new Controller();
