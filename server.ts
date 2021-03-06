import express, {
  Application as App,
  NextFunction as Next,
  Request as Req,
  Response as Res,
} from 'express';
import http from 'http';
import morgan from 'morgan';

import { ApiError, apiErrorResponse } from './api/common/errors';
import { validateEngineAction } from './api/common/validators';
import { controller } from './api/controller';

const app: App = express();

app.use(express.json());

// Logs HTTP activity to console (or disk if configured)
app.use(
  morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common', {
    skip: () => process.env.NODE_ENV === 'test',
  })
);

app.get('/vehicles/:id', controller.getVehicleInfo);
app.get('/vehicles/:id/doors', controller.getDoorState);
app.get('/vehicles/:id/fuel', controller.getFuelState);
app.get('/vehicles/:id/battery', controller.getBatteryState);
app.post(
  '/vehicles/:id/engine',
  validateEngineAction,
  controller.setEngineState
);

// 404 Handler
app.use((req: Req, res: Res, next: Next) => {
  const err = new ApiError('Resource not Found.');
  next(err);
});

// Catches errors explicitly thrown with next()
app.use((err: ApiError, req: Req, res: Res, next: Next) => {
  const result: apiErrorResponse = {
    message: err.message || 'Resource not Found.',
    status: err.status || 404,
  };
  return res.status(result.status).json(result);
});

export const server = http.createServer(app);
const PORT = process.env.PORT || '8080';

if (require.main === module) {
  server.listen(PORT, () => {
    console.info(`Server listening on ${PORT}`);
  });
}

process.on('unhandledRejection', () => {
  console.error(
    'Uncaught exception here. Should be logged and handled accordingly.'
  );
});
