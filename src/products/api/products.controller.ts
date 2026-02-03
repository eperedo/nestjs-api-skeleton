import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { GetProductByIdUseCase } from 'src/products/domain/usecases/GetProductByIdUseCase';
import { SaveProductUseCase } from 'src/products/domain/usecases/SaveProductUseCase';
import { CreateProductDto } from './dto/create-product.dto';
import type { LoggerService } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly saveProductUseCase: SaveProductUseCase,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    this.logger.log({ message: 'products.getById.request', id });
    return this.getProductByIdUseCase.execute(id).catch(() => {
      this.logger.warn({ message: 'products.getById.notFound', id });
      throw new NotFoundException('Product not found');
    });
  }

  @Post()
  async create(@Body() body: CreateProductDto) {
    await this.saveProductUseCase
      .execute({
        userId: body.userId,
        product: {
          ...body.product,
          categoryId: body.product.categoryId ?? undefined,
        },
      })
      .catch((error) => {
        const isKnownError = error as Error;
        throw new BadRequestException(isKnownError.message);
      });

    return { status: 'ok' };
  }
}
