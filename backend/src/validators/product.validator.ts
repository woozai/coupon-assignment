import { body, param, ValidationChain } from 'express-validator';
import { CouponValueType } from '../types/product.types.js';

const couponValueTypes = Object.values(CouponValueType);

const sharedCreateOrUpdateRules = (): ValidationChain[] => {
  return [
    body('name')
      .optional()
      .isString()
      .trim()
      .notEmpty()
      .withMessage('name must be a non-empty string.'),
    body('description')
      .optional()
      .isString()
      .trim()
      .notEmpty()
      .withMessage('description must be a non-empty string.'),
    body('imageUrl')
      .optional()
      .isString()
      .trim()
      .notEmpty()
      .withMessage('imageUrl must be a non-empty string.'),
    body('costPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('costPrice must be a number greater than or equal to 0.'),
    body('marginPercentage')
      .optional()
      .isFloat({ min: 0 })
      .withMessage(
        'marginPercentage must be a number greater than or equal to 0.',
      ),
    body('value')
      .optional()
      .isString()
      .trim()
      .notEmpty()
      .withMessage('value must be a non-empty string.'),
    body('valueType')
      .optional()
      .isIn(couponValueTypes)
      .withMessage(`valueType must be one of: ${couponValueTypes.join(', ')}.`),
  ];
};

// Keep route-level validation reusable so admin and reseller routes can share param rules.
export const validateProductIdParam = (): ValidationChain[] => {
  return [
    param('productId')
      .isMongoId()
      .withMessage('productId must be a valid MongoDB id.'),
  ];
};

export const validateCreateProduct = (): ValidationChain[] => {
  return [
    body('name')
      .exists({ checkFalsy: true })
      .withMessage('name is required.'),
    body('description')
      .exists({ checkFalsy: true })
      .withMessage('description is required.'),
    body('imageUrl')
      .exists({ checkFalsy: true })
      .withMessage('imageUrl is required.'),
    body('costPrice')
      .exists()
      .withMessage('costPrice is required.'),
    body('marginPercentage')
      .exists()
      .withMessage('marginPercentage is required.'),
    body('value')
      .exists({ checkFalsy: true })
      .withMessage('value is required.'),
    body('valueType')
      .exists({ checkFalsy: true })
      .withMessage('valueType is required.'),
    ...sharedCreateOrUpdateRules(),
  ];
};

export const validateUpdateProduct = (): ValidationChain[] => {
  return sharedCreateOrUpdateRules();
};
