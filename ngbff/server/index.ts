import './common/env';
import Server from './common/server';
import routes from './routes';

const port = parseInt(process.env.PORT ?? '3000');
export default (async () => {
  (await new Server().router(routes)).listen(port);
})();
