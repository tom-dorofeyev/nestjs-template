import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@Exclude()
export class CreateSuperHeroDto {
  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  alias: string;

  @Expose()
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  powers: string[];

  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  weaknesses?: string[];
}
