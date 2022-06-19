import { Request, Response } from 'express';

export class Controller {
  me(_: Request, res: Response): void {
    res.json('Welcome, TODO: username');
  }
}
export default new Controller();
