import { Either } from '../generic/Either';
import { ErrorValidation } from '../generic/ErrorValidation';
import { Struct } from '../generic/Struct';
import { Id } from '../generic/Base';

export type UserRole = 'admin' | 'guest';

export type UserAttrs = {
  id: Id;
  username: string;
  role: UserRole;
};

export class User extends Struct<UserAttrs>() {
  static build(data: UserAttrs): Either<ErrorValidation<User>[], User> {
    const validationErrors = User.validate(data);
    if (validationErrors.length > 0) {
      return Either.error(validationErrors);
    }

    return Either.success(User.create(data));
  }

  private static validate(data: UserAttrs): ErrorValidation<User>[] {
    const idErrors: ErrorValidation<User>[] = !data.id
      ? [{ property: 'id', errors: [{ code: 'required' }] }]
      : [];

    const usernameErrors: ErrorValidation<User>[] = !data.username
      ? [{ property: 'username', errors: [{ code: 'required' }] }]
      : [];

    const roleErrors: ErrorValidation<User>[] = data.role
      ? []
      : [{ property: 'role', errors: [{ code: 'required' }] }];

    return [...idErrors, ...usernameErrors, ...roleErrors].filter(
      (validation) => validation.errors.length > 0,
    );
  }
}
