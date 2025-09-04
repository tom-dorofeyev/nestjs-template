import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ISuperhero } from '../schemas/superhero.schema';

export class SuperheroResponseDto implements ISuperhero {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  alias: string;

  @ApiProperty()
  powers: string[];

  @ApiPropertyOptional()
  weaknesses?: string[];

  static fromSuperhero(superhero: ISuperhero): SuperheroResponseDto {
    return {
      id: superhero.id,
      name: superhero.name,
      alias: superhero.alias,
      powers: superhero.powers,
      weaknesses: superhero.weaknesses,
    };
  }

  static fromSuperheroList(superheros: ISuperhero[]): SuperheroResponseDto[] {
    return superheros.map(this.fromSuperhero);
  }
}
