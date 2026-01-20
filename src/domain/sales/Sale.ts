import { Either } from '../generic/Either';
import { ErrorValidation } from '../generic/ErrorValidation';
import { Struct } from '../generic/Struct';
import { Id } from '../generic/Base';
import { Quantity } from './Quantity';

export type SaleItemAttrs = {
  productId: Id;
  quantity: number;
  price: number;
  subtotal: number;
};

export type SaleAttrs = {
  id: Id;
  customerId: Id;
  discount: number;
  total: number;
  items: SaleItemAttrs[];
};

export class Sale extends Struct<SaleAttrs>() {
  static build(data: SaleAttrs): Either<ErrorValidation<Sale>[], Sale> {
    const validationErrors = Sale.validate(data);
    if (validationErrors.length > 0) {
      return Either.error(validationErrors);
    }

    const recalculatedItems = data.items.map((item) => ({
      ...item,
      subtotal: Quantity.create(item.quantity) * item.price,
    }));

    const totalBeforeDiscount = recalculatedItems.reduce(
      (sum, item) => sum + item.subtotal,
      0,
    );

    const recalculatedTotal = totalBeforeDiscount - data.discount;

    return Either.success(
      Sale.create({
        ...data,
        items: recalculatedItems,
        total: recalculatedTotal,
      }),
    );
  }

  private static validate(data: SaleAttrs): ErrorValidation<Sale>[] {
    const error = (
      property: keyof Sale,
      code: string,
    ): ErrorValidation<Sale> => ({
      property,
      errors: [{ code }],
    });

    const idErrors = !data.id ? [error('id', 'required')] : [];
    const customerErrors = !data.customerId
      ? [error('customerId', 'required')]
      : [];
    const itemsErrors =
      data.items.length === 0 ? [error('items', 'required')] : [];
    const discountErrors =
      data.discount < 0 ? [error('discount', 'invalid')] : [];

    const quantityErrors = data.items.flatMap((item) => {
      try {
        Quantity.create(item.quantity);
        return [];
      } catch {
        return [error('items', 'invalid_quantity')];
      }
    });

    const totalErrors = (() => {
      if (quantityErrors.length > 0) {
        return [];
      }

      const totalBeforeDiscount = data.items.reduce(
        (sum, item) => sum + Quantity.create(item.quantity) * item.price,
        0,
      );
      const recalculatedTotal = totalBeforeDiscount - data.discount;
      return recalculatedTotal < 0 ? [error('total', 'invalid')] : [];
    })();

    return [
      ...idErrors,
      ...customerErrors,
      ...itemsErrors,
      ...discountErrors,
      ...quantityErrors,
      ...totalErrors,
    ].filter((validation) => validation.errors.length > 0);
  }
}
