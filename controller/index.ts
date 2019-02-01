import { NextFunction as Next, Request as Req, Response as Res } from 'express';

import { adapters } from '../adapters';
import { BaseApiMethods } from '../base/baseApiMethods';
import { ApiError } from '../base/errors';
import { mapIdToManufacturer } from '../base/helpers';

/**
 * Controllers can only handle methods that are defined in BaseApiMethods.
 */
const controllerFactory = (method: keyof BaseApiMethods) => async (
  req: Req,
  res: Res,
  next: Next
): Promise<any> => {
  const { id } = req.params;
  const { body } = req;

  const manufacturer = mapIdToManufacturer(id);
  if (!manufacturer) return next(new ApiError('Vehicle not found.'));

  const adapter: BaseApiMethods = adapters[manufacturer];
  if (!adapter) return next(new ApiError(`${manufacturer} is not supported.`));

  const state = await adapter[method](id, body);
  return res.status(200).json(state);
};

export const controller = {
  getBatteryState: controllerFactory('getBatteryState'),
  getDoorState: controllerFactory('getDoorState'),
  getFuelState: controllerFactory('getFuelState'),
  getVehicleInfo: controllerFactory('getVehicleInfo'),
  setEngineState: controllerFactory('setEngineState'),
};
