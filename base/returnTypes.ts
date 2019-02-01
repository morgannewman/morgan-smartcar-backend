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
