import { Either } from '../generic/Either';
import { ErrorValidation } from '../generic/ErrorValidation';
import { Struct } from '../generic/Struct';
import { Id } from '../generic/Base';

export type CustomerType = 'premium' | 'basic';

export type CustomerAttrs = {
  id: Id;
  name: string;
  isActive: boolean;
  type: CustomerType;
};

export class Customer extends Struct<CustomerAttrs>() {
  static build(
    data: CustomerAttrs,
  ): Either<ErrorValidation<Customer>[], Customer> {
    const validationErrors = Customer.validate(data);
    if (validationErrors.length > 0) {
      return Either.error(validationErrors);
    }

    return Either.success(Customer.create(data));
  }

  private static validate(data: CustomerAttrs): ErrorValidation<Customer>[] {
    const idErrors: ErrorValidation<Customer>[] = !data.id
      ? [{ property: 'id', errors: [{ code: 'required' }] }]
      : [];

    const nameErrors: ErrorValidation<Customer>[] = !data.name
      ? [{ property: 'name', errors: [{ code: 'required' }] }]
      : [];

    const typeErrors: ErrorValidation<Customer>[] = data.type
      ? []
      : [{ property: 'type', errors: [{ code: 'required' }] }];

    return [...idErrors, ...nameErrors, ...typeErrors].filter(
      (validation) => validation.errors.length > 0,
    );
  }
}
