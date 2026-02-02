import { Product, ProductAttrs } from './Product';

const validData: ProductAttrs = {
  id: 'product-id',
  name: 'Product Name',
  code: 'ABCDEF12',
  categoryId: undefined,
};

describe('Product', () => {
  it('returns success for valid data', () => {
    const result = Product.build(validData);

    expect(result.isSuccess()).toBe(true);
    if (result.isSuccess()) {
      expect(result.value.data).toEqual(Product.create(validData));
    }
  });

  it('returns required errors when fields are missing', () => {
    const result = Product.build({
      id: '',
      name: '',
      code: '',
      categoryId: undefined,
    });

    expect(result.isError()).toBe(true);
    if (result.isError()) {
      expect(result.value.error).toEqual([
        { property: 'id', errors: [{ code: 'required' }] },
        { property: 'name', errors: [{ code: 'required' }] },
        { property: 'code', errors: [{ code: 'required' }] },
      ]);
    }
  });

  it('returns length error when code is too short', () => {
    const result = Product.build({
      ...validData,
      code: 'SHORT1',
    });

    expect(result.isError()).toBe(true);
    if (result.isError()) {
      expect(result.value.error).toEqual([
        { property: 'code', errors: [{ code: 'invalid_length' }] },
      ]);
    }
  });

  it('returns length error when code is too long', () => {
    const result = Product.build({
      ...validData,
      code: 'TOO-LONG-CODE-123',
    });

    expect(result.isError()).toBe(true);
    if (result.isError()) {
      expect(result.value.error).toEqual([
        { property: 'code', errors: [{ code: 'invalid_length' }] },
      ]);
    }
  });
});
