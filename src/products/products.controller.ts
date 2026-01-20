import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { GetProductByIdUseCase } from 'src/domain/products/GetProductByIdUseCase';
import { SaveProductUseCase } from 'src/domain/products/SaveProductUseCase';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly saveProductUseCase: SaveProductUseCase,
  ) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.getProductByIdUseCase.execute(id).catch(() => {
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
