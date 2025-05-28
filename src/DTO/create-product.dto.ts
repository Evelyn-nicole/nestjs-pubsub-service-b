import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsInt,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEmail,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class VariantDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  type: string;

  @IsInt()
  @Min(0)
  volume_ml: number;

  @IsNumber()
  alcohol_percentage: number;
}

class ContactDto {
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(20)
  phone: string;
}

class AddressDto {
  @IsString()
  @MaxLength(128)
  street: string;

  @IsString()
  @MaxLength(64)
  city: string;

  @IsString()
  @MaxLength(64)
  country: string;
}

class SupplierDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  name: string;

  @ValidateNested()
  @Type(() => ContactDto)
  contact: ContactDto;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @IsInt()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  brand?: string;

  @IsDateString()
  created_at: string;

  @IsBoolean()
  available: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants: VariantDto[];

  @ValidateNested()
  @Type(() => SupplierDto)
  supplier: SupplierDto;
}
