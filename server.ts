import express, {
  Application as App,
  NextFunction as Next,
  Request as Req,
  Response as Res,
} from 'express';

import controller from './controller';

export const app: App = express();

app.use(express.json());

app.get('/vehicles/:id', controller.getVehicleInfo);
app.get('/vehicles/:id/doors', controller.getDoorState);
app.get('/vehicles/:id/fuel', controller.getFuelState);
app.get('/vehicles/:id/battery', controller.getBatteryState);
app.post('/vehicles/:id/engine', controller.setEngineState);

const PORT = process.env.PORT || '8080';
app
  .listen(PORT, () => {
    console.info(`Server listening on ${PORT}`);
  })
  .on('error', (err) => {
    console.error(err);
  });
