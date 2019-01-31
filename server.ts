import express, {
  Application as App,
  NextFunction as Next,
  Request as Req,
  Response as Res,
} from 'express';

import {
  getBatteryState,
  getDoorState,
  getFuelState,
  getVehicleInfo,
  setEngineState,
} from './adapter';

export const app: App = express();

app.use(express.json());

app.get('/vehicles/:id', async (req: Req, res: Res, next: Next) => {
  const id = req.params.id;
  const info = await getVehicleInfo(id);
  return res.status(200).json(info);
});

app.get('/vehicles/:id/doors', async (req: Req, res: Res, next: Next) => {
  const id = req.params.id;
  const info = await getDoorState(id);
  return res.status(200).json(info);
});

app.get('/vehicles/:id/fuel', async (req: Req, res: Res, next: Next) => {
  const id = req.params.id;
  const info = await getFuelState(id);
  return res.status(200).json(info);
});

app.get('/vehicles/:id/battery', async (req: Req, res: Res, next: Next) => {
  const id = req.params.id;
  const info = await getBatteryState(id);
  return res.status(200).json(info);
});

app.post('/vehicles/:id/engine', async (req: Req, res: Res, next: Next) => {
  const id = req.params.id;
  const action = req.body;
  const info = await setEngineState(id, action);
  return res.status(200).json(info);
});

const PORT = process.env.PORT || '8080';
app
  .listen(PORT, () => {
    console.info(`Server listening on ${PORT}`);
  })
  .on('error', (err) => {
    console.error(err);
  });
