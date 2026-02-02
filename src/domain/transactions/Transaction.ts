import { Either } from '../generic/Either';
import { ErrorValidation } from '../generic/ErrorValidation';
import { Struct } from '../generic/Struct';
import { Id } from '../generic/Base';

export type TransactionAttrs = {
  id: Id;
  amount: number;
  saleId: Id;
};

export class Transaction extends Struct<TransactionAttrs>() {
  static build(
    data: TransactionAttrs,
  ): Either<ErrorValidation<Transaction>[], Transaction> {
    const validationErrors = Transaction.validate(data);
    if (validationErrors.length > 0) {
      return Either.error(validationErrors);
    }

    return Either.success(Transaction.create(data));
  }

  private static validate(
    data: TransactionAttrs,
  ): ErrorValidation<Transaction>[] {
    const idErrors: ErrorValidation<Transaction>[] = !data.id
      ? [{ property: 'id', errors: [{ code: 'required' }] }]
      : [];

    const saleIdErrors: ErrorValidation<Transaction>[] = !data.saleId
      ? [{ property: 'saleId', errors: [{ code: 'required' }] }]
      : [];

    const amountErrors: ErrorValidation<Transaction>[] =
      data.amount < 0
        ? [{ property: 'amount', errors: [{ code: 'invalid' }] }]
        : [];

    return [...idErrors, ...saleIdErrors, ...amountErrors].filter(
      (validation) => validation.errors.length > 0,
    );
  }
}
