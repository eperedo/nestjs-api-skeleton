import { Maybe } from 'src/shared/utils/ts-utils';

import { Either } from 'src/shared/domain/Either';
import { ErrorValidation } from 'src/shared/domain/ErrorValidation';
import { Struct } from 'src/shared/domain/Struct';
import { Id } from 'src/shared/domain/Base';

export type ProductAttrs = {
  id: Id;
  name: string;
  code: string;
  categoryId: Maybe<string>;
};

export class Product extends Struct<ProductAttrs>() {
  static build(
    data: ProductAttrs,
  ): Either<ErrorValidation<Product>[], Product> {
    const validationErrors = Product.validate(data);
    if (validationErrors.length > 0) {
      return Either.error(validationErrors);
    }

    return Either.success(Product.create(data));
  }

  private static validate(data: ProductAttrs): ErrorValidation<Product>[] {
    const idErrors: ErrorValidation<Product>[] = !data.id
      ? [{ property: 'id', errors: [{ code: 'required' }] }]
      : [];

    const nameErrors: ErrorValidation<Product>[] = !data.name
      ? [{ property: 'name', errors: [{ code: 'required' }] }]
      : [];

    const codeErrors = Product.validateCode(data.code);

    return [...idErrors, ...nameErrors, ...codeErrors].filter(
      (validation) => validation.errors.length > 0,
    );
  }

  private static validateCode(code: string): ErrorValidation<Product>[] {
    const codeLength = code.length;
    const isValidLength = codeLength >= 8 && codeLength <= 13;

    return codeLength === 0
      ? [{ property: 'code', errors: [{ code: 'required' }] }]
      : !isValidLength
        ? [{ property: 'code', errors: [{ code: 'invalid_length' }] }]
        : [];
  }
}
