import { Either } from '../generic/Either';
import { ErrorValidation } from '../generic/ErrorValidation';
import { Struct } from '../generic/Struct';
import { Id } from '../generic/Base';

type CategoryAttrs = {
  id: Id;
  name: string;
};

export class Category extends Struct<CategoryAttrs>() {
  static build(
    data: CategoryAttrs,
  ): Either<ErrorValidation<Category>[], Category> {
    const validationErrors = Category.validate(data);
    if (validationErrors.length > 0) {
      return Either.error(validationErrors);
    }

    return Either.success(Category.create(data));
  }

  private static validate(data: CategoryAttrs): ErrorValidation<Category>[] {
    const idErrors: ErrorValidation<Category>[] = !data.id
      ? [{ property: 'id', errors: [{ code: 'required' }] }]
      : [];

    const nameErrors: ErrorValidation<Category>[] = !data.name
      ? [{ property: 'name', errors: [{ code: 'required' }] }]
      : [];

    return [...idErrors, ...nameErrors].filter(
      (validation) => validation.errors.length > 0,
    );
  }
}
