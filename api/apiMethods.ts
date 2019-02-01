import {
  batteryState,
  doorLockState,
  engineAction,
  engineState,
  fuelState,
  vehicleInfo,
} from './apiReturnTypes';

export interface BaseApiMethods {
  getVehicleInfo: (id: string) => Promise<vehicleInfo>;
  getDoorState: (id: string) => Promise<doorLockState>;
  getBatteryState: (id: string) => Promise<batteryState>;
  getFuelState: (id: string) => Promise<fuelState>;
  setEngineState: (id: string, action: engineAction) => Promise<engineState>;
}
