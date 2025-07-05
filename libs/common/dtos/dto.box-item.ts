import { IsNotEmpty, IsString,IsOptional,IsNumber, Min } from "class-validator";

export class BoxItemDto {
  
 @IsString()
 @IsOptional()
  productId: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsOptional()
  description?: string | null;
  @IsNotEmpty()
  @IsNumber({maxDecimalPlaces:0})
  @Min(1)
  quantity: number;
   constructor(partial?: Partial<BoxItemDto>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
export class UpdateBoxItemDto extends BoxItemDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}