import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateHeroDto } from './dto/request/create-hero.dto';
import { HeroService } from './hero.service';
import { Hero } from './hero.entity';
import { MakeDefaultDto } from './dto/request/make-default.dto';
import Serialize from '@/decorators/serialize.decorator';
import { HeroResponseDto } from './dto/response/hero-response.dto';
import { HeroDto } from './dto/response/hero.dto';
import { PaginatedHerosDto } from './dto/response/paginated-heros.dto';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

// @UseGuards(AuthGuard('jwt'))
@Controller('admin/heros')
export class HeroAdminController {
    constructor(private _heroService: HeroService) { }
    @Serialize(PaginatedHerosDto)
    @Get()
  @ApiOperation({ summary: 'Get All heros' })
    findAllHeros() {
        return this._heroService.getAllHeros();
    }
    
    @Serialize(HeroDto)
  @ApiOperation({ summary: 'Get Active hero' })

    @Get('activeHero')
    findActiveHero() {
        return this._heroService.getActiveHero()
    }
 
    @Serialize(HeroDto)
  @ApiOperation({ summary: 'Get Hero by id' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Hero ID' })
    @Get(':id')
    findById(@Param('id') id: number) {
        return this._heroService.getHero(id)
    }

    // @UseGuards(RolesGuard)
    // @Roles(Role.MODERATOR)
    @Serialize(HeroResponseDto)
    @Post()
  @ApiOperation({ summary: 'Create Hero' })

    createHero(@Body() body: CreateHeroDto) {
        return this._heroService.createHero(body)
    }

    // @UseGuards(RolesGuard)
    // @Roles(Role.MODERATOR)
    @Serialize(HeroResponseDto)
    @Patch('makeItActive/:id')
  @ApiOperation({ summary: 'Activate Hero' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Hero ID' })

    makeItActive(@Param('id') id: number, @Body() { isActive }: MakeDefaultDto) {
        return this._heroService.makeItActive(id, isActive)
    }
}