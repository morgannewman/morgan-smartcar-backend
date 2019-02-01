export type gmVehicleInfo = {
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

export type gmDoorLockState = {
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

export type gmEnergyState = {
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

export type gmEngineState = {
  service: 'actionEngine';
  status: string;
  actionResult: {
    status: 'EXECUTED' | 'FAILED';
  };
};
