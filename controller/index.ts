import { NextFunction as Next, Request as Req, Response as Res } from 'express';

import { adapters } from '../adapters';
import { BaseApiMethods } from '../base/baseApiMethods';
import { ApiError } from '../base/errors';
import { mapIdToManufacturer } from '../base/helpers';

/**
 * Controllers can only handle methods that are defined in BaseApiMethods.
 * 1. Maps the given ID to a manufacturer key
 * 2. Select the correct API adapter based on the manufacturer
 * 3. Uses the adapter to execute the correct API method
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
  if (!adapter) {
    // This technically should never happen, but I have trust issues.
    return next(new ApiError(`${manufacturer} is not supported.`));
  }

  try {
    const state = await adapter[method](id, body);
    return res.status(200).json(state);
  } catch (e) {
    // Handles the adapter backend request failing. Would need to be more
    // sophisticated in production.
    return next(
      new ApiError('Call the paramedics! Our servers are down.', 503)
    );
  }
};

export const controller = {
  getBatteryState: controllerFactory('getBatteryState'),
  getDoorState: controllerFactory('getDoorState'),
  getFuelState: controllerFactory('getFuelState'),
  getVehicleInfo: controllerFactory('getVehicleInfo'),
  setEngineState: controllerFactory('setEngineState'),
};
