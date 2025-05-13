import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hero } from './hero.entity';
import { Not, Repository } from 'typeorm';
import { UploadImageService } from 'src/upload-image/upload-image.service';
import { CreateHeroDto } from './dto/create-hero.dto';

@Injectable()
export class HeroService {
  constructor(
    @InjectRepository(Hero) private _heroRepo: Repository<Hero>,
    private _uploadImageService: UploadImageService,
  ) {}


  /**
   * create hero
   */

  async createHero(heroData:CreateHeroDto): Promise<{message:string, hero:Hero}> {
    const imagesUrls:string[] = []
    heroData.imagesIds.forEach(async (id:string) => {
        const image = await this._uploadImageService.getImageById(+id)
        imagesUrls.push(image.imagePath)
    })
    const hero = this._heroRepo.create({
        isActive:heroData.isActive,
        imagesUrls
    })
    await this._heroRepo.save(hero)
    return {
        message: 'Hero created successfully',
        hero:hero
    }
  }

  /**
   * get all heros
   */

  async getAllHeros():Promise<Hero[]> {
    return this._heroRepo.find()
  }


  /**
   * get hero by id
   */

  async getHero(id:number):Promise<Hero> {
        if(!id) {
            throw new NotFoundException('Hero Not Found')
        }
        const hero = await this._heroRepo.findOneBy({ id });
        if (!hero) {
            throw new NotFoundException('Event Not Found');
        }
        return hero;
  }

  /**
   * make hero active
   */

  async makeItActive(id:number, isActive:boolean):Promise<{message:string, hero:Hero}> {
   const savedHero = await this.getHero(id);

  // Only proceed if there is actually a change
  if (savedHero.isActive === isActive) {
    return {
      message: 'No changes made',
      hero: savedHero,
    };
  }

  // If activating this hero
  if (isActive) {
    // Deactivate all heroes
    await this._heroRepo.update({ isActive: true }, { isActive: false });
  }

  // If deactivating this hero and it was active before
  if (!isActive && savedHero.isActive) {
    // Find the next hero to make active (e.g., by lowest ID or other logic)
    const otherHero = await this._heroRepo.findOne({
      where: { id: Not(id) },
      order: { id: 'ASC' },
    });

    if (otherHero) {
      otherHero.isActive = true;
      await this._heroRepo.save(otherHero);
    }
  }

  // Now update the target hero
  const updatedHero = {
    ...savedHero,
    isActive,
  };
  await this._heroRepo.save(updatedHero);

  return {
    message: 'Hero updated successfully',
    hero: updatedHero,
  };
  }
}
