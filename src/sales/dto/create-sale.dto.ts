import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SaleItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}

class SaleDto {
  @IsString()
  id: string;

  @IsString()
  customerId: string;

  @IsNumber()
  discount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];
}

export class CreateSaleDto {
  @IsString()
  transactionId: string;

  @ValidateNested()
  @Type(() => SaleDto)
  sale: SaleDto;
}
