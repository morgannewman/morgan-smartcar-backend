import axios from 'axios';

// Smartcar API definitions
import { BaseApiMethods } from '../../apiMethods';
import {
  batteryState,
  doorLockState,
  engineAction,
  engineState,
  fuelState,
  vehicleInfo,
} from '../../apiReturnTypes';

// GM API definitions
import { gmNormalizer } from './gmNormalizer';
import {
  gmDoorLockState,
  gmEnergyState,
  gmEngineState,
  gmVehicleInfo,
} from './gmTypes';

const gmRequest = async (
  endpoint: string,
  id: string,
  other?: any
): Promise<any> => {
  const res = await axios.post('http://gmapi.azurewebsites.net' + endpoint, {
    id,
    responseType: 'JSON',
    ...other,
  });
  return res.data;
};

/**
 * By implementing BaseApiMethods, it is safe to use this adapter as a strategy
 * for any methods supported in the API.
 */
export const gm: BaseApiMethods = {
  getVehicleInfo: async (id: string): Promise<vehicleInfo> => {
    const info: gmVehicleInfo = await gmRequest('/getVehicleInfoService', id);
    return gmNormalizer.vehicleInfo(info);
  },

  getDoorState: async (id: string): Promise<doorLockState> => {
    const doorState: gmDoorLockState = await gmRequest(
      '/getSecurityStatusService',
      id
    );
    return (
      gmNormalizer
        .doorState(doorState)
        // Ensures this list always returns in the same order
        .sort((a, b) => a.location.localeCompare(b.location))
    );
  },

  getBatteryState: async (id: string): Promise<batteryState> => {
    const energyState: gmEnergyState = await gmRequest('/getEnergyService', id);
    return gmNormalizer.batteryState(energyState);
  },

  getFuelState: async (id: string): Promise<fuelState> => {
    const energyState: gmEnergyState = await gmRequest('/getEnergyService', id);
    return gmNormalizer.fuelState(energyState);
  },

  setEngineState: async (
    id: string,
    action: engineAction
  ): Promise<engineState> => {
    const gmAction = {
      command: action.action === 'START' ? 'START_VEHICLE' : 'STOP_VEHICLE',
    };

    const state: gmEngineState = await gmRequest(
      '/actionEngineService',
      id,
      gmAction
    );
    return gmNormalizer.engineState(state);
  },
};
