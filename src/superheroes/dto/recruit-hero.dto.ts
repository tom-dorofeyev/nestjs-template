import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

@Exclude()
export class RecruitHeroDto {
  @Expose()
  @ApiProperty({ description: 'Team name to recruit the hero into' })
  @IsNotEmpty()
  @IsString()
  teamName: string;

  @Expose()
  @ApiProperty({ description: 'Equipment IDs to assign to the hero' })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  @ArrayNotEmpty()
  equipmentIds: string[];
}
