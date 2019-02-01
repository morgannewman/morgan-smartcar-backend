import axios from 'axios';

// Smartcar API definitions
import { BaseApiMethods } from '../../base/baseApiMethods';
import {
  batteryState,
  doorLockState,
  engineAction,
  engineState,
  fuelState,
  vehicleInfo,
} from '../../base/returnTypes';

// GM API definitions
import {
  normalizeGmBatteryState,
  normalizeGmDoorState,
  normalizeGmEngineState,
  normalizeGmFuelState,
  normalizeGmVehicleInfo,
} from './gmNormalizers';
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

export const gm: BaseApiMethods = {
  getVehicleInfo: async (id: string): Promise<vehicleInfo> => {
    const info: gmVehicleInfo = await gmRequest('/getVehicleInfoService', id);
    return normalizeGmVehicleInfo(info);
  },

  getDoorState: async (id: string): Promise<doorLockState> => {
    const doorState: gmDoorLockState = await gmRequest(
      '/getSecurityStatusService',
      id
    );
    return normalizeGmDoorState(doorState);
  },

  getBatteryState: async (id: string): Promise<batteryState> => {
    const energyState: gmEnergyState = await gmRequest('/getEnergyService', id);
    return normalizeGmBatteryState(energyState);
  },

  getFuelState: async (id: string): Promise<fuelState> => {
    const energyState: gmEnergyState = await gmRequest('/getEnergyService', id);
    return normalizeGmFuelState(energyState);
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
    return normalizeGmEngineState(state);
  },
};
