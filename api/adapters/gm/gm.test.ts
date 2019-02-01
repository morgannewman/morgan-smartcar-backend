import { gm } from './';

/**
 * Overview of Test File
 * 1. Define mock data and validators
 * 2. Define an array of method tests
 * 3. Programmatically construct tests from the array
 *
 * Could probably be improved by more modularization if this were to be a
 * production application.
 *
 * Could probably be improved by assigning more meaningful names to each test.
 */

/**
 * Mock data and validators
 */

const gasVehicleInfo = {
  color: 'Metallic Silver',
  doorCount: 4,
  driveTrain: 'v8',
  vin: '123123412412',
};

const electricVehicleInfo = {
  color: 'Forest Green',
  doorCount: 2,
  driveTrain: 'electric',
  vin: '1235AZ91XP',
};

const isValidDoorState = (state: any): boolean => {
  if (!Array.isArray(state)) throw new Error();
  for (const door of state) {
    if (typeof door !== 'object') throw new Error();
    if (!door.hasOwnProperty('location') || !door.hasOwnProperty('locked'))
      throw new Error();
    if (typeof door.location !== 'string') throw new Error();
    if (typeof door.locked !== 'boolean') throw new Error();
  }
  return true;
};

const isValidBatteryState = (state: any): boolean => {
  if (typeof state !== 'object' || !state.hasOwnProperty('percent'))
    throw new Error();
  if (state.percent === null || typeof state.percent === 'number') return true;
  else throw new Error();
};

const isValidFuelState = isValidBatteryState;

const isValidEngineState = (state: any): boolean => {
  if (typeof state !== 'object' || !state.hasOwnProperty('status'))
    throw new Error();
  if (state.status === 'success' || state.status === 'error') return true;
  else throw new Error();
};

/**
 * Test Setup
 */

const methods = [
  {
    name: 'getVehicleInfo',
    testCases: [
      { args: [ 1234 ], expected: gasVehicleInfo },
      { args: [ 1235 ], expected: electricVehicleInfo },
    ],
  },
  {
    name: 'getDoorState',
    testCases: [
      { args: [ 1234 ], expected: isValidDoorState },
      { args: [ 1235 ], expected: isValidDoorState },
    ],
  },
  {
    name: 'getBatteryState',
    testCases: [
      { args: [ 1234 ], expected: isValidBatteryState },
      { args: [ 1235 ], expected: isValidBatteryState },
    ],
  },
  {
    name: 'getFuelState',
    testCases: [
      { args: [ 1234 ], expected: isValidFuelState },
      { args: [ 1235 ], expected: isValidFuelState },
    ],
  },
  {
    name: 'setEngineState',
    testCases: [
      {
        args: [ 1234, { action: 'START' } ],
        expected: isValidEngineState,
      },
      {
        args: [ 1235, { action: 'STOP' } ],
        expected: isValidEngineState,
      },
    ],
  },
];

/**
 * Test Runner
 */

describe('GM Adapter', () => {
  for (const method of methods) {
    const methodName = method.name;

    describe(methodName, () => {
      for (const test of method.testCases) {
        const { args, expected } = test;

        it('Returns the correct data given valid args', async () => {
          const res = await gm[methodName](...args);

          // Expected output can be either a validator function or an exact value
          if (typeof expected === 'function') {
            expect(expected(res)).toEqual(true);
          } else {
            expect(expected).toEqual(res);
          }
        });
      }
    });
  }
});
