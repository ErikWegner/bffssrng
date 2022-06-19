import { Request, Response } from 'express';
import l from '../../../common/logger';

export class Controller {
  me(req: Request, res: Response): void {
    l.info({ user: req.user }, 'user');
    res.json('Welcome, TODO: username');
  }
}
export default new Controller();
