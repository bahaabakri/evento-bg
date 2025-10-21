import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateHeroDto } from './dto/request/create-hero.dto';
import { HeroService } from './hero.service';
import { Hero } from './hero.entity';
import { MakeDefaultDto } from './dto/request/make-default.dto';
import Serialize from 'src/decorators/serialize.decorator';
import { HeroResponseDto } from './dto/response/hero-response.dto';
import { HeroDto } from './dto/response/hero.dto';
import { PaginatedHerosDto } from './dto/response/paginated-heros.dto';
import { ApiOperation } from '@nestjs/swagger';
import { GuestGuard } from '../auth/guards/guest.guard';
@UseGuards(GuestGuard)
@Controller('heros')
export class HeroUserController {
  constructor(private _heroService: HeroService) {}
  @Serialize(HeroDto)
  @Get('activeHero')
  @ApiOperation({ summary: 'Get Active hero' })
  findActiveHero() {
    return this._heroService.getActiveHero();
  }
  
  @Serialize(PaginatedHerosDto)
  @Get()
  @ApiOperation({ summary: 'Get All heros' })
  findAllHeros() {
    return this._heroService.getAllHeros();
  }
}
