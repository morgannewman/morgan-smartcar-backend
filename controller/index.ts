import { NextFunction as Next, Request as Req, Response as Res } from 'express';

import { adapters } from '../adapters';
import { BaseApiMethods } from '../base/baseApiMethods';
import {
  batteryState,
  doorLockState,
  engineAction,
  engineState,
  fuelState,
  vehicleInfo,
} from '../base/returnTypes';

import { ApiError } from '../base/errors';

const vehicles = {
  1234: 'gm',
  1235: 'gm',
};

/**
 * This method is a stub. In a production application, there would need to be
 * some implementation to map an arbitrary vehicle ID to a manufacturer string.
 */
const mapIdToManufacturer = (id: string): string | undefined => {
  return vehicles[id];
};

export default {
  getBatteryState: async (req: Req, res: Res, next: Next): Promise<any> => {
    const { id } = req.params;

    const manufacturer = mapIdToManufacturer(id);
    if (!manufacturer) return next(new ApiError('Vehicle not found.'));

    const adapter: BaseApiMethods = adapters[manufacturer];
    if (!adapter)
      return next(new ApiError(`${manufacturer} is not supported.`));

    const state: batteryState = await adapter.getBatteryState(id);
    return res.status(200).json(state);
  },

  getDoorState: async (req: Req, res: Res, next: Next): Promise<any> => {
    const { id } = req.params;

    const manufacturer = mapIdToManufacturer(id);
    if (!manufacturer) return next(new ApiError('Vehicle not found.'));

    const adapter: BaseApiMethods = adapters[manufacturer];
    if (!adapter)
      return next(new ApiError(`${manufacturer} is not supported.`));

    const state: doorLockState = await adapter.getDoorState(id);
    return res.status(200).json(state);
  },

  getVehicleInfo: async (req: Req, res: Res, next: Next): Promise<any> => {
    const { id } = req.params;

    const manufacturer = mapIdToManufacturer(id);
    if (!manufacturer) return next(new ApiError('Vehicle not found.'));

    const adapter: BaseApiMethods = adapters[manufacturer];
    if (!adapter)
      return next(new ApiError(`${manufacturer} is not supported.`));

    const state: vehicleInfo = await adapter.getVehicleInfo(id);
    return res.status(200).json(state);
  },

  getFuelState: async (req: Req, res: Res, next: Next): Promise<any> => {
    const { id } = req.params;

    const manufacturer = mapIdToManufacturer(id);
    if (!manufacturer) return next(new ApiError('Vehicle not found.'));

    const adapter: BaseApiMethods = adapters[manufacturer];
    if (!adapter)
      return next(new ApiError(`${manufacturer} is not supported.`));

    const state: fuelState = await adapter.getFuelState(id);
    return res.status(200).json(state);
  },

  setEngineState: async (req: Req, res: Res, next: Next): Promise<any> => {
    const { id } = req.params;

    const action: engineAction = req.body;
    if (!(action.action === 'START' || action.action === 'STOP'))
      return next(
        new ApiError('Body must be formatted as {"action": "START|STOP"}.', 400)
      );

    const manufacturer = mapIdToManufacturer(id);
    if (!manufacturer) return next(new ApiError('Vehicle not found.', 400));

    const adapter: BaseApiMethods = adapters[manufacturer];
    if (!adapter)
      return next(new ApiError(`${manufacturer} is not supported.`));

    const state: engineState = await adapter.setEngineState(id, action);
    return res.status(200).json(state);
  },
};
