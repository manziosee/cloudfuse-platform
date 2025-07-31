import { ValidationError } from 'class-validator';

export function formatValidationErrors(errors: ValidationError[]) {
  return errors.reduce((acc: { [key: string]: string[] }, error) => {
    acc[error.property] = error.constraints ? Object.values(error.constraints) : [];
    return acc;
  }, {});
}