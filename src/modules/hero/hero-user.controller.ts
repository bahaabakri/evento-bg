import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateHeroDto } from './dto/request/create-hero.dto';
import { HeroService } from './hero.service';
import { Hero } from './hero.entity';
import { MakeDefaultDto } from './dto/request/make-default.dto';
import Serialize from 'src/decorators/serialize.decorator';
import { HeroResponseDto } from './dto/response/hero-response.dto';
import { HeroDto } from './dto/response/hero.dto';
import { PaginatedHerosDto } from './dto/response/paginated-heros.dto';

// @UseGuards(AuthGuard('jwt'))
@Controller('heros')
export class HeroUserController {
    constructor(private _heroService: HeroService) { }
    @Serialize(HeroDto)
    @Get('activeHero')
    findActiveHero() {
        return this._heroService.getActiveHero()
    }
    @Serialize(PaginatedHerosDto)
    @Get()
    findAllHeros() {
        return this._heroService.getAllHeros();
    }

}