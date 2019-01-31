import * as adapter from './adapter';

describe('Adapters', () => {
  describe('GM', () => {
    it('Should return things', async () => {
      const test = await adapter.setEngineState('1235', { action: 'STOP' });
      console.log(test);
    });
  });
});
