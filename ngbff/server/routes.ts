import { Application } from 'express';
import examplesRouter from './api/controllers/examples/router';
import meRouter from './api/controllers/me/router';

export default function routes(app: Application): void {
  app.use('/api/v1/me', meRouter);
  app.use('/api/v1/examples', examplesRouter);
}
