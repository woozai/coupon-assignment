import { body, ValidationChain } from 'express-validator';

export const validateAdminLogin = (): ValidationChain[] => {
  return [
    body('email')
      .isEmail()
      .withMessage('email must be a valid email address.'),
    body('password')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('password is required.'),
  ];
};
