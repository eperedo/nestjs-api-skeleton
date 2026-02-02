import { prisma } from '../src/prisma-client';

const main = async () => {
  await prisma.customer.upsert({
    where: { id: 'customer-1' },
    update: {},
    create: {
      id: 'customer-1',
      name: 'Customer One',
      isActive: true,
      type: 'basic',
    },
  });

  await prisma.product.upsert({
    where: { id: 'product-1' },
    update: {},
    create: {
      id: 'product-1',
      name: 'Product One',
      code: 'ABCDEFGH',
      categoryId: null,
    },
  });
};

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    return prisma.$disconnect().then(() => process.exit(1));
  });
