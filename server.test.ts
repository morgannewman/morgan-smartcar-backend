import axios, { AxiosResponse } from 'axios';
import { server } from './server';

/**
 * Overview of Test File
 * 1. Define mock data and validators
 * 2. Define an array of integration tests
 * 3. Programmatically construct tests from the array
 *
 * Could probably be improved by more modularization if this were to be a
 * production application.
 *
 * Could probably be improved by assigning more meaningful names to each test.
 */

type testCase = {
  id: string;
  body?: any;
  expected: any;
  type: 'valid' | 'invalid';
};

type integrationTest = {
  endpoint: '/' | '/doors' | '/fuel' | '/battery' | '/engine';
  method: 'get' | 'post';
  testCases: testCase[];
};

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

const isApiError = (res: AxiosResponse): boolean => {
  if (res.status < 400) throw new Error();
  const data = res.data;
  if (
    typeof data === 'object' &&
    data.hasOwnProperty('message') &&
    data.hasOwnProperty('status')
  )
    return true;
  else throw new Error();
};

const isValidDoorState = (res: AxiosResponse): boolean => {
  const state = res.data;
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

const isValidBatteryState = (res: AxiosResponse): boolean => {
  if (res.status !== 200) throw new Error();
  const state = res.data;
  if (typeof state !== 'object' || !state.hasOwnProperty('percent'))
    throw new Error();
  if (state.percent === null || typeof state.percent === 'number') return true;
  else throw new Error();
};

const isValidFuelState = isValidBatteryState;

const isValidEngineState = (res: AxiosResponse): boolean => {
  if (res.status !== 200) throw new Error();
  const state = res.data;
  if (typeof state !== 'object' || !state.hasOwnProperty('status'))
    throw new Error();
  if (state.status === 'success' || state.status === 'error') return true;
  else throw new Error();
};

/**
 * Integration Tests
 */

const tests: integrationTest[] = [
  {
    endpoint: '/',
    method: 'get',
    testCases: [
      { id: '1234', expected: gasVehicleInfo, type: 'valid' },
      { id: '1235', expected: electricVehicleInfo, type: 'valid' },
      { id: 'invalidIdHere', expected: isApiError, type: 'invalid' },
    ],
  },
  {
    endpoint: '/battery',
    method: 'get',
    testCases: [
      { id: '1234', expected: isValidBatteryState, type: 'valid' },
      { id: '1235', expected: isValidBatteryState, type: 'valid' },
      { id: 'invalidIdHere', expected: isApiError, type: 'invalid' },
    ],
  },
  {
    endpoint: '/doors',
    method: 'get',
    testCases: [
      { id: '1234', expected: isValidDoorState, type: 'valid' },
      { id: '1235', expected: isValidDoorState, type: 'valid' },
      { id: 'invalidIdHere', expected: isApiError, type: 'invalid' },
    ],
  },
  {
    endpoint: '/fuel',
    method: 'get',
    testCases: [
      { id: '1234', expected: isValidFuelState, type: 'valid' },
      { id: '1235', expected: isValidFuelState, type: 'valid' },
      { id: 'invalidIdHere', expected: isApiError, type: 'invalid' },
    ],
  },
  {
    endpoint: '/engine',
    method: 'post',
    testCases: [
      {
        body: { action: 'START' },
        expected: isValidEngineState,
        id: '1234',
        type: 'valid',
      },
      {
        body: { action: 'STOP' },
        expected: isValidEngineState,
        id: '1234',
        type: 'valid',
      },
      {
        body: { action: 'saddsa' },
        expected: isApiError,
        id: '1234',
        type: 'invalid',
      },
      {
        body: { action: 'STOP' },
        expected: isValidEngineState,
        id: '1235',
        type: 'valid',
      },
      {
        body: { action: 'START' },
        expected: isValidEngineState,
        id: '1235',
        type: 'valid',
      },
      { id: '1235', body: {}, expected: isApiError, type: 'invalid' },
      {
        body: {},
        expected: (res: AxiosResponse) => res.status === 400,
        id: '1235',
        type: 'invalid',
      },
      { id: 'invalidIdHere', expected: isApiError, type: 'invalid' },
    ],
  },
];

/**
 * Test Runner
 */

beforeAll(() => {
  server.listen(8090);
});

afterAll(() => {
  server.close();
});

const BASE_URL = 'http://127.0.0.1:8090/vehicles';

describe('Integration Tests', () => {
  for (const testEndpoint of tests) {
    const { endpoint, method, testCases } = testEndpoint;

    describe(endpoint, () => {
      for (const [ index, test ] of testCases.entries()) {
        const { id, body: data, expected, type } = test;

        const description =
          type === 'valid'
            ? `[${index}] Returns valid output given valid input`
            : `[${index}] Returns an error given invalid input`;

        it(description, async () => {
          const path = `${BASE_URL}/${id}${endpoint}`;

          // @ts-ignore: ignore incorrect axios type-def
          const res = await axios(path, {
            data,
            method,
            // Only throw 500-level errors
            validateStatus: (status: number): boolean => status < 500,
          });

          // Expected can be either a validator or a literal value
          if (typeof expected === 'function') {
            expect(expected(res)).toBe(true);
          } else {
            expect(res.data).toEqual(expected);
          }
        });
      }
    });
  }
});
