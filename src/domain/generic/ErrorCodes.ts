export const ErrorCodes = {
  products: {
    USER_NOT_AUTHORIZED: 'User is not authorized',
    VALIDATION_FAILED: 'PRODUCT_VALIDATION_FAILED',
  },
  sales: {
    CUSTOMER_INACTIVE: 'CUSTOMER_INACTIVE',
    VALIDATION_FAILED: 'SALE_VALIDATION_FAILED',
  },
} as const;
