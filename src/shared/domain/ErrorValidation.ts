export type ErrorValidation<T> = {
  property: keyof T;
  errors: Array<{ code: string }>;
};
