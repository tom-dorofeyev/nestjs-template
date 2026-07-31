import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RecruitmentSagaService } from 'src/saga/recruitment-saga.service';
import { RecruitHeroDto } from 'src/superheroes/dto/recruit-hero.dto';
import { RecruitHeroResponseDto } from 'src/superheroes/dto/recruit-hero.response.dto';

@ApiTags('recruitment')
@Controller('superheroes')
export class RecruitmentController {
  constructor(private readonly sagaService: RecruitmentSagaService) {}

  @ApiOkResponse({
    description: 'Hero recruited successfully',
    type: RecruitHeroResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Superhero not found' })
  @ApiConflictResponse({ description: 'Superhero has already been recruited' })
  @ApiInternalServerErrorResponse({
    description: 'Recruitment failed and rolled back',
    type: RecruitHeroResponseDto,
  })
  @ApiBody({ type: RecruitHeroDto })
  @Post(':id/recruit')
  async recruit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ transform: true })) dto: RecruitHeroDto,
  ): Promise<RecruitHeroResponseDto> {
    const result = await this.sagaService.recruit(
      id,
      dto.teamName,
      dto.equipmentIds,
    );
    if (result.status === 'COMPLETED') {
      return RecruitHeroResponseDto.fromSuccess(result);
    }
    throw new HttpException(
      RecruitHeroResponseDto.fromRolledBack(result),
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
