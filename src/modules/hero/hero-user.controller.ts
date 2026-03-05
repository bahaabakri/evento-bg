import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { HeroService } from './hero.service';
import { Hero } from './hero.entity';
import { MakeDefaultDto } from './dto/request/make-default.dto';
import Serialize from 'src/decorators/serialize.decorator';
import { HeroResponseDto } from './dto/response/hero-response.dto';
import { HeroDto } from './dto/response/hero.dto';
import { PaginatedHerosDto } from './dto/response/paginated-heros.dto';
import { ApiOperation } from '@nestjs/swagger';
import { GuestGuard } from '../auth/guards/guest.guard';
import SearchHeroDto from './dto/request/search-hero.dto';
@UseGuards(GuestGuard)
@Controller('heroes')
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
  @ApiOperation({ summary: 'Get All heroes' })
  findAllHeroes(@Query() query: SearchHeroDto) {
    return this._heroService.getAllHeroes(query);
  }
}
