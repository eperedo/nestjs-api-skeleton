import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import type { Maybe } from 'src/shared/utils/ts-utils';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsOptional()
  @IsString()
  categoryId: Maybe<string>;
}
