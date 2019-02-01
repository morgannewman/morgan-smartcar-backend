import { gm } from './gm';

/**
 * This is the entrypoint to register adapters. You can think of these adapters
 * as strategies. They all implement or extend the base API interface.
 *
 * A current limitation of adapters is they are not resilient to bad inputs.
 */
export const adapters = {
  gm,
};
