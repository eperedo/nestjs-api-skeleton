import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';

describe('SalesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates sale and transaction', async () => {
    const time = Date.now().toString();
    const saleId = `sale-${time}`;
    const transactionId = `txn-${time}`;

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

    await request(app.getHttpServer())
      .post('/sales')
      .send({
        transactionId,
        sale: {
          id: saleId,
          customerId: 'customer-1',
          discount: 5,
          items: [{ productId: 'product-1', quantity: 2, price: 10 }],
        },
      })
      .expect(201);

    const sale = await prisma.sale.findFirst({ where: { id: saleId } });
    const transaction = await prisma.transaction.findFirst({
      where: { id: transactionId },
    });

    expect(sale?.total).toBe(15);
    expect(transaction?.amount).toBe(15);
  });
});
