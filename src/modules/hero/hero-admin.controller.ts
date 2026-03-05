import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUpdateHeroDto } from './dto/request/create-update-hero.dto';
import { HeroService } from './hero.service';
import { Hero } from './hero.entity';
import { MakeDefaultDto } from './dto/request/make-default.dto';
import Serialize from '@/decorators/serialize.decorator';
import { HeroResponseDto } from './dto/response/hero-response.dto';
import { HeroDto } from './dto/response/hero.dto';
import { PaginatedHerosDto } from './dto/response/paginated-heros.dto';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GuestGuard } from '../auth/guards/guest.guard';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';
import { Permissions } from '../permissions/decorators/permissions.decorator';
import SearchHeroDto from './dto/request/search-hero.dto';
@Controller('admin/heroes')
export class HeroAdminController {
  constructor(private _heroService: HeroService) {}

  @Serialize(HeroDto)
  @UseGuards(GuestGuard)
  @ApiOperation({ summary: 'Get Active hero (No Auth)' })
  @Get('activeHero')
  findActiveHero() {
    return this._heroService.getActiveHero();
  }

  @Serialize(PaginatedHerosDto)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('view_hero')
  @Get()
  @ApiOperation({ summary: 'Get All heroes' })
  findAllHeroes(@Query() query: SearchHeroDto) {
    return this._heroService.getAllHeroes(query);
  }

  @Serialize(HeroDto)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('view_hero')
  @ApiOperation({ summary: 'Get Hero by id' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Hero ID' })
  @Get(':id')
  findById(@Param('id') id: number) {
    return this._heroService.getHero(id);
  }

  @Serialize(HeroResponseDto)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('create_hero')
  @Post()
  @ApiOperation({ summary: 'Create Hero' })
  createHero(@Body() body: CreateUpdateHeroDto) {
    return this._heroService.createHero(body);
  }

  @Serialize(HeroResponseDto)
  @Permissions('update_hero')
  @Patch(':id')
  @ApiOperation({ summary: 'Update Hero' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Hero ID' })
  async updateEvent(
    @Param('id') id: number,
    @Body() heroData: CreateUpdateHeroDto,
  ) {
    const event = await this._heroService.updateHero(id, heroData);
    return event;
  }

  @Serialize(HeroResponseDto)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('activate_hero')
  @Patch('makeItActive/:id')
  @ApiOperation({ summary: 'Activate Hero' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Hero ID' })
  makeItActive(@Param('id') id: number, @Body() { isActive }: MakeDefaultDto) {
    return this._heroService.makeItActive(id, isActive);
  }

  @Serialize(HeroResponseDto)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('delete_hero')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Hero' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Hero ID' })
  deleteHero(@Param('id') id: number) {
    return this._heroService.deleteHero(id);
  }
}
