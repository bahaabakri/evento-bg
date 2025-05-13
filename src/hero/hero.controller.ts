import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateHeroDto } from './dto/create-hero.dto';
import { HeroService } from './hero.service';
import { Hero } from './hero.entity';
import { MakeDefaultDto } from './dto/make-default.dto';

@Controller('hero')
export class HeroController {
    constructor(private _heroService:HeroService){}
    @Get()
    findAllHeros(): Promise<Hero[]> {
        return this._heroService.getAllHeros();
    }

    @Get(':id')
    findById(@Param('id') id:number): Promise<Hero> {
        return this._heroService.getHero(id)
    }

    @Post()
    createHero(@Body() body:CreateHeroDto) {
        return this._heroService.createHero(body)
    }

    @Patch('makeItActive/:id')
    makeItActive(@Param('id') id:number, @Body() {isActive}:MakeDefaultDto) {
        return this._heroService.makeItActive(id, isActive)
    }
}