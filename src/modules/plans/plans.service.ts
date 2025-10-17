import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanEntity } from './plan.entity';
import { CreatePlanDto } from './dto/request/create-plan.dto';
import { EventsService } from '../events/events.service';
import { SearchPlanDto } from './dto/request/search-plan.dto';
import { PaginatedResult } from '@/types/types';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(PlanEntity) private _planRepo: Repository<PlanEntity>,
    private _eventService: EventsService,
  ) {}

  /* 
    Create plan
    */
  async createPlan(
    planDate: CreatePlanDto,
  ): Promise<{ message: string; plan: PlanEntity }> {
    // 1️⃣ Find the event
    const event = await this._eventService.getEventById(planDate.eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    const plan = this._planRepo.create({
      ...planDate,
      event,
    });
    const createdSavedPlan = await this._planRepo.save(plan);
    return {
      message: 'Plan created successfully',
      plan: createdSavedPlan,
    };
  }

  /**
   * Get event plans
   */
  async getEventPlans({
    eventId,
    page = 1,
    perPage = 10,
  }: SearchPlanDto): Promise<PaginatedResult<PlanEntity>> {
    const skip = (page - 1) * perPage;
    const [plans, total] = await this._planRepo.findAndCount({
      where: { event: { id: eventId } },
      relations: ['event', 'tickets'],
      skip,
      take: perPage,
      order: { id: 'DESC' },
    });
    return {
      data: plans,
      meta: {
        total,
        page,
        perPage,
      },
    };
  }

  /**
   * Get plan by id
   */
  async getPlanById(id: number): Promise<PlanEntity> {
    if (!id) {
      throw new NotFoundException('Plan Not Found');
    }
    const plan = await this._planRepo.findOne({
      where: { id },
      relations: {
        event: {
          createdBy: true,
          joinedUsers: true
        },
        tickets: true
      },
    });
    if (!plan) {
      throw new NotFoundException('Plan Not Found');
    }
    return plan;
  }
}
