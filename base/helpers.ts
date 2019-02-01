import { NextFunction as Next, Request as Req, Response as Res } from 'express';
import { ApiError } from './errors';
import { engineAction } from './returnTypes';

/**
 * This method is a stub. In a production application, there would need to be
 * some implementation to map an arbitrary vehicle ID to a manufacturer string.
 */
export const mapIdToManufacturer = (id: string): string | undefined => {
  const vehicles = {
    1234: 'gm',
    1235: 'gm',
  };
  return vehicles[id];
};

export const validateEngineAction = (req: Req, res: Res, next: Next): any => {
  const action: engineAction = req.body;

  if (!(action.action === 'START' || action.action === 'STOP'))
    return next(
      new ApiError('Body must be formatted as {"action": "START|STOP"}.', 400)
    );

  return next();
};
