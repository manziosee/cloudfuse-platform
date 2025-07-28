import { ValidationError } from 'class-validator';

export function formatValidationErrors(errors: ValidationError[]) {
  return errors.reduce((acc, error) => {
    acc[error.property] = Object.values(error.constraints);
    return acc;
  }, {});
}