import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateHeroDto } from './dto/request/create-hero.dto';
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
@Controller('admin/heros')
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
  @ApiOperation({ summary: 'Get All heros' })
  findAllHeros() {
    return this._heroService.getAllHeros();
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
  createHero(@Body() body: CreateHeroDto) {
    return this._heroService.createHero(body);
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
}
