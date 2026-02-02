export type Quantity = number;

export const Quantity = {
  create(value: number): Quantity {
    if (value <= 0) {
      throw new Error('QUANTITY_INVALID');
    }

    return value;
  },
};
