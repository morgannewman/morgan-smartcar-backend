import axios from 'axios';

/**
 * INTERFACE TYPE DEFS
 */

export type vehicleInfo = {
  vin: string;
  color: string;
  doorCount: number;
  driveTrain: string;
};

export type doorLockState = Array<{
  location: 'frontLeft' | 'frontRight' | 'backLeft' | 'backRight';
  locked: boolean;
}>;

export type fuelState = {
  percent: number | null;
};

export type engineAction = {
  action: 'START' | 'STOP';
};

export type engineState = {
  status: 'success' | 'error';
};

export type batteryState = {
  percent: number | null;
};

/**
 * ADAPTER TYPE DEFS
 */

export type GmVehicleInfo = {
  service: 'getVehicleInfo';
  status: string;
  data: {
    color: {
      type: 'String';
      value: string;
    };
    driveTrain: {
      type: 'String';
      value: string;
    };
    fourDoorSedan: {
      type: 'Boolean';
      value: string;
    };
    twoDoorCoupe: {
      type: 'Boolean';
      value: string;
    };
    vin: {
      type: 'String';
      value: string;
    };
  };
};

export type gmSecurityInfo = {
  service: 'getSecurityStatus';
  status: string;
  data: {
    doors: {
      type: 'Array';
      values: Array<{
        location: {
          type: 'String';
          value: 'frontLeft' | 'frontRight' | 'backLeft' | 'backRight';
        };
        locked: {
          type: 'Boolean';
          value: 'True' | 'False';
        };
      }>;
    };
  };
};

type gmFuelInfo = {
  service: 'getEnergyService';
  status: string;
  data: {
    tankLevel: {
      type: 'Number' | 'Null';
      value: string | 'null';
    };
    batteryLevel: {
      type: 'Number' | 'Null';
      value: string | 'null';
    };
  };
};

type gmEngineState = {
  service: 'actionEngine';
  status: string;
  actionResult: {
    status: 'EXECUTED' | 'FAILED';
  };
};

/**
 * ADAPTERS
 */

const normalizeGmVehicleInfo = (info: GmVehicleInfo): vehicleInfo => {
  const isFourDoor = info.data.fourDoorSedan.value === 'True';
  return {
    color: info.data.color.value,
    doorCount: isFourDoor ? 4 : 2,
    driveTrain: info.data.driveTrain.value,
    vin: info.data.vin.value,
  };
};

const normalizeGmDoorState = (info: gmSecurityInfo): doorLockState => {
  const doors = info.data.doors.values;
  return doors.map((door) => ({
    location: door.location.value,
    locked: door.locked.value === 'True' ? true : false,
  }));
};

const normalizeGmFuelState = (info: gmFuelInfo): fuelState => {
  const fuelLevel = info.data.tankLevel.value;
  return {
    percent: fuelLevel === 'null' ? null : Number(fuelLevel),
  };
};

const normalizeGmBatteryState = (info: gmFuelInfo): batteryState => {
  const batteryLevel = info.data.batteryLevel.value;
  return {
    percent: batteryLevel === 'null' ? null : Number(batteryLevel),
  };
};

const normalizeGmEngineState = (info: gmEngineState): engineState => {
  const result = info.actionResult.status;
  return {
    status: result === 'EXECUTED' ? 'success' : 'error',
  };
};

/**
 * Controllers
 */

export const getVehicleInfo = async (id: string): Promise<vehicleInfo> => {
  const res = await axios.post(
    'http://gmapi.azurewebsites.net/getVehicleInfoService',
    {
      id,
      responseType: 'JSON',
    }
  );
  return normalizeGmVehicleInfo(res.data);
};

export const getDoorState = async (id: string): Promise<doorLockState> => {
  const res = await axios.post(
    'http://gmapi.azurewebsites.net/getSecurityStatusService',
    {
      id,
      responseType: 'JSON',
    }
  );
  return normalizeGmDoorState(res.data);
};

export const getFuelState = async (id: string): Promise<fuelState> => {
  const res = await axios.post(
    'http://gmapi.azurewebsites.net/getEnergyService',
    {
      id,
      responseType: 'JSON',
    }
  );

  return normalizeGmFuelState(res.data);
};

export const getBatteryState = async (id: string): Promise<batteryState> => {
  const res = await axios.post(
    'http://gmapi.azurewebsites.net/getEnergyService',
    {
      id,
      responseType: 'JSON',
    }
  );

  return normalizeGmBatteryState(res.data);
};

export const setEngineState = async (
  id: string,
  action: engineAction
): Promise<engineState> => {
  const res = await axios.post(
    'http://gmapi.azurewebsites.net/actionEngineService',
    {
      command: action.action === 'START' ? 'START_VEHICLE' : 'STOP_VEHICLE',
      id,
      responseType: 'JSON',
    }
  );

  return normalizeGmEngineState(res.data);
};
