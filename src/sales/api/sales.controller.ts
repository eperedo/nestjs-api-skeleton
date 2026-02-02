import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { SaveSaleUseCase } from 'src/sales/domain/usecases/SaveSaleUseCase';
import { ErrorCodes } from 'src/shared/domain/ErrorCodes';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly saveSaleUseCase: SaveSaleUseCase) {}

  @Post()
  async create(@Body() body: CreateSaleDto) {
    await this.saveSaleUseCase
      .execute({
        ...body.sale,
        transactionId: body.transactionId,
        total: 0,
        items: body.sale.items.map((item) => ({
          ...item,
          subtotal: 0,
        })),
      })
      .catch((error) => {
        const isKnownError = error as Error;
        throw new BadRequestException(
          isKnownError.message || ErrorCodes.sales.VALIDATION_FAILED,
        );
      });

    return { status: 'ok' };
  }
}
