import { Sale } from './Sale';

describe('Sale', () => {
  const baseSale = {
    id: 'sale-1',
    customerId: 'customer-1',
    discount: 5,
    total: 0,
    items: [
      {
        productId: 'product-1',
        quantity: 2,
        price: 10,
        subtotal: 0,
      },
    ],
  };

  it('recalculates subtotals and total', () => {
    const result = Sale.build(baseSale);

    expect(result.isSuccess()).toBe(true);
    if (result.isSuccess()) {
      expect(result.value.data.items[0].subtotal).toBe(20);
      expect(result.value.data.total).toBe(15);
    }
  });

  it('fails when quantity is invalid', () => {
    const result = Sale.build({
      ...baseSale,
      items: [{ ...baseSale.items[0], quantity: 0 }],
    });

    expect(result.isError()).toBe(true);
  });

  it('fails when discount is negative', () => {
    const result = Sale.build({
      ...baseSale,
      discount: -1,
    });

    expect(result.isError()).toBe(true);
  });

  it('fails when items are empty', () => {
    const result = Sale.build({
      ...baseSale,
      items: [],
    });

    expect(result.isError()).toBe(true);
  });
});
