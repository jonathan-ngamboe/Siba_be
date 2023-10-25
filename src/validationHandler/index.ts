import { NextFunction, Request, Response } from 'express';
/*
  ---- EXPRESS VALIDATOR ----
  Express-validator is a library that can be used to validate the data
  coming from the frontend or other client
  https://express-validator.github.io/docs/
*/
import {
  Result,
  ValidationError,
  check,
  validationResult,
} from 'express-validator'; // import { body, validationResult } ???

import { validationErrorHandler } from '../responseHandler/index.js';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const validationResults: Result<ValidationError> = validationResult(req);

  if (!validationResults.isEmpty()) {
    validationErrorHandler(req, res, 'Validation', validationResults);
    return;
  } else {
    next();
  }
};

export const validateIdObl = [
  check('id')
    // Nice way to make e.g. valid id 4015 fail for testing
    // .isLength({ min: 1, max: 1 })
    // .withMessage('Id Must be between 1-1 characters long')
    // .bail()
    .matches(/^[0-9]+$/)
    .withMessage('Id must be a number')
    .bail()
    .notEmpty()
    .withMessage('Id cannot be empty')
    .bail(),
];
export const validateNameObl = [
  check('name')
    .isLength({ min: 2, max: 255 })
    .withMessage('Must be between 2-255 characters long')
    .bail()
    .matches(/^[A-Za-zäöåÄÖÅ0-9\s-]*$/)
    .withMessage('Must contain only letters, numbers and -')
    .bail()
    .notEmpty()
    .withMessage('Cannot be empty')
    .bail(),
];

export const validateDescription = [
  check('description')
    .isLength({ min: 2, max: 255 })
    .withMessage('Must be between 2-255 characters long')
    .bail()
    .matches(/^[A-Za-zäöåÄÖÅ0-9\s-]*$/)
    .withMessage('Must contain only letters, numbers and -')
    .bail(),
  /* LATER:
  check('description').isLength({ max: 16000 })
    .withMessage('Must be at maximum 16000 characters long')
    .matches(/^[A-Za-zäöåÄÖÅ0-9\s-]*$/)
    .withMessage('Must contain only letters, numbers and -')
    .bail(),
  */
];

export const validateDescriptionObl = [
  ...validateDescription,
  check('description')
    .notEmpty()
    .withMessage('Description cannot be empty')
    .bail(),
];

export const validatePriorityMustBeNumber = [
  check('priority').matches(/^[0-9]+$/).withMessage('Must be a number').bail(),
];

export const validateAddEquipment = [
  ...validateNameObl,
  ...validateDescriptionObl,
  ...validatePriorityMustBeNumber,
  check('isMovable')
    .matches(/^[01]$/)
    .withMessage('isMovable needs to be 1 = can be moved, 0 = cannot be moved.')
    .bail(),
];

export const validateAddSetting = [
  ...validateNameObl,
  ...validateDescriptionObl,
];

export const validateAddUpdateDepartment = [
  ...validateNameObl,
  ...validateDescriptionObl,
];
