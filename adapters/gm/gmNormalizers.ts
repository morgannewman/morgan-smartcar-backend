import {
  batteryState,
  doorLockState,
  engineAction,
  engineState,
  fuelState,
  vehicleInfo,
} from '../../base/returnTypes';

import {
  gmDoorLockState,
  gmEnergyState,
  gmEngineState,
  gmVehicleInfo,
} from './gmTypes';

export const normalizeGmVehicleInfo = (info: gmVehicleInfo): vehicleInfo => {
  const isFourDoor = info.data.fourDoorSedan.value === 'True';
  return {
    color: info.data.color.value,
    doorCount: isFourDoor ? 4 : 2,
    driveTrain: info.data.driveTrain.value,
    vin: info.data.vin.value,
  };
};

export const normalizeGmDoorState = (info: gmDoorLockState): doorLockState => {
  const doors = info.data.doors.values;
  return doors.map((door) => ({
    location: door.location.value,
    locked: door.locked.value === 'True' ? true : false,
  }));
};

export const normalizeGmFuelState = (info: gmEnergyState): fuelState => {
  const fuelLevel = info.data.tankLevel.value;
  return {
    percent: fuelLevel === 'null' ? null : Number(fuelLevel),
  };
};

export const normalizeGmBatteryState = (info: gmEnergyState): batteryState => {
  const batteryLevel = info.data.batteryLevel.value;
  return {
    percent: batteryLevel === 'null' ? null : Number(batteryLevel),
  };
};

export const normalizeGmEngineState = (info: gmEngineState): engineState => {
  const result = info.actionResult.status;
  return {
    status: result === 'EXECUTED' ? 'success' : 'error',
  };
};
