import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hero } from './hero.entity';
import { Like, Not, Repository } from 'typeorm';
import { UploadImageService } from '@/modules/upload-image/upload-image.service';
import { ImageObject, PaginatedResult } from '@/types/types';
import { validateId } from '@/util';
import { CreateUpdateHeroDto } from './dto/request/create-update-hero.dto';
import { HeroDto } from './dto/response/hero.dto';

@Injectable()
export class HeroService {
  constructor(
    @InjectRepository(Hero) private _heroRepo: Repository<Hero>,
    private _uploadImageService: UploadImageService,
  ) {}

  /**
   * create hero
   */

  async createHero(
    heroData: CreateUpdateHeroDto,
  ): Promise<{ message: string; hero: Hero }> {
    const images: ImageObject[] = await Promise.all(
      heroData.imagesIds.map(async (id: number) => {
        const image = await this._uploadImageService.getImageById(id);
        return {
          id: image.id,
          name: image.name,
          url: image.imagePath,
        };
      }),
    );

    const hero = this._heroRepo.create({
      isActive: false,
      images,
      name: heroData.name,
      title: heroData.title,
      description: heroData.description,
    });

    const createdSavedHero = await this._heroRepo.save(hero);

    if (heroData.isActive) {
      await this.makeItActive(createdSavedHero.id, true);
    }
    return {
      message: 'Hero created successfully',
      hero: createdSavedHero,
    };
  }

  /**
   * Update hero by ID
   * @param id
   * @param heroData
   * @returns
   */
  async updateHero(
    id: number,
    heroData: CreateUpdateHeroDto,
  ): Promise<{ message: string; event: Hero }> {
    // Here you would typically update hero in a database
    // For this example, we'll just return the updated hero data
    const savedHero = await this.getHero(id);
    let updatedHero = { ...savedHero, ...heroData };
    if (heroData.imagesIds) {
      const images: ImageObject[] = [];
      for (const id of heroData.imagesIds) {
        const image = await this._uploadImageService.getImageById(id);
        images.push({
          id: image.id,
          name: image.name,
          url: image.imagePath,
        });
      }
      updatedHero = { ...updatedHero, images };
    }
    const updatedSavedHero = await this._heroRepo.save(updatedHero);
    return {
      message: 'Hero updated successfully',
      event: updatedSavedHero,
    };
  }

  /**
   * get all heros
   */

  async getAllHeroes({
    page = 1,
    perPage = 10,
    query,
  }): Promise<PaginatedResult<Hero>> {
    const [heroes, total] = await this._heroRepo.findAndCount({
      where: query ? { title: Like(`%${query}%`) } : {},
      take: perPage,
      skip: (page - 1) * perPage,
    });
    return {
      data: heroes,
      meta: {
        total,
        page,
        perPage,
      },
    };
  }

  /**
   * get hero by id
   */

  async getHero(id: number): Promise<Hero> {
    const hero = await this._heroRepo.findOneBy({ id: validateId(id) });
    if (!hero) {
      throw new NotFoundException('Hero Not Found');
    }
    return hero;
  }

  /*
   * get active hero
   */

  async getActiveHero(): Promise<Hero> {
    const activeHero = await this._heroRepo.findOneBy({ isActive: true });
    if (!activeHero) {
      throw new NotFoundException('Active Hero Not Found');
    }
    return activeHero;
  }

  /**
   * make hero active
   */

  async makeItActive(
    id: number,
    isActive: boolean,
  ): Promise<{ message: string; hero: Hero }> {
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

  /**
   * delete hero
   */

  async deleteHero(id: number): Promise<{ message: string; hero: Hero }> {
    const hero = await this.getHero(id);
    if (!hero) {
      throw new NotFoundException('Hero Not Found');
    }
    const removedHero = await this._heroRepo.remove(hero);
    // If the deleted hero was active, we should activate another one
    if (removedHero.isActive) {
      const otherHero = await this._heroRepo.findOne({
        where: { id: Not(id) },
        order: { id: 'ASC' },
      });

      if (otherHero) {
        otherHero.isActive = true;
        await this._heroRepo.save(otherHero);
      }
    }
    return {
      message: 'Hero deleted successfully',
      hero: removedHero,
    };
  }
}
