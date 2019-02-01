import { NextFunction as Next, Request as Req, Response as Res } from 'express';
import { engineAction } from '../adapters/apiReturnTypes';
import { ApiError } from './errors';

export const validateEngineAction = (req: Req, res: Res, next: Next): any => {
  const action: engineAction = req.body;

  if (!(action.action === 'START' || action.action === 'STOP'))
    return next(
      new ApiError('Body must be formatted as {"action": "START|STOP"}.', 400)
    );

  return next();
};
