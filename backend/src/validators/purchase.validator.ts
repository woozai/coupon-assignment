import { body, ValidationChain } from 'express-validator';

// Keep purchase validation isolated because this payload has its own pricing rule semantics.
export const validatePurchaseProduct = (): ValidationChain[] => {
  return [
    body('resellerPrice')
      .exists()
      .withMessage('resellerPrice is required.')
      .bail()
      .isFloat({ min: 0 })
      .withMessage('resellerPrice must be a number greater than or equal to 0.'),
  ];
};
