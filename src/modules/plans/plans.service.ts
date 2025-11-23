import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PlanEntity } from './plan.entity';
import { CreateUpdatePlanDto } from './dto/request/create-update-plan.dto';
import { EventsService } from '../events/events.service';
import { SearchPlanDto } from './dto/request/search-plan.dto';
import { PaginatedResult } from '@/types/types';
import { validateId } from '@/util';
import { EventEntity } from '../events/event.entity';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(PlanEntity) private _planRepo: Repository<PlanEntity>,
    private _eventsService: EventsService,
    private readonly dataSource: DataSource,
  ) {}

  /* 
    Create plan
    */
  async createPlan(
    planDate: CreateUpdatePlanDto,
  ): Promise<{ message: string; plan: PlanEntity }> {
    // 1️⃣ Find the event
    const event = await this._eventsService.getEventById(planDate.eventId);
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
    const plan = await this._planRepo.findOne({
      where: { id: validateId(id) },
      relations: {
        event: {
          createdBy: true,
          tickets: true,
        },
        tickets: true,
      },
    });
    if (!plan) {
      throw new NotFoundException('Plan Not Found');
    }
    return plan;
  }

  /**
   * Update Plan
   */
  async updatePlan(
    planId: number,
    planData: Partial<CreateUpdatePlanDto>,
  ): Promise<{ message: string; plan: PlanEntity }> {
    const savedPlan = await this.getPlanById(planId);
    let updatedPlan = { ...savedPlan, ...planData };
    const updatedAndSavedPlan = await this._planRepo.save(updatedPlan);
    return {
      message: 'Plan updated successfully',
      plan: updatedAndSavedPlan,
    };
  }
  /**
   * Update plan capacity
   */
  async updatePlanCapacity(planId: number, updatedSoldSeats: number) {
    // await this.dataSource.transaction(async (manager) => {
    const plan = await this._planRepo.findOne({
      where: { id: validateId(planId) },
    });

    if (!plan) throw new NotFoundException('Plan not found');

    if (updatedSoldSeats > plan.capacity) {
      throw new BadRequestException('Not enough seats available');
    }
    // Atomic update with QueryBuilder
    await this._planRepo
      .createQueryBuilder()
      .update(PlanEntity)
      .set({
        soldSeats: updatedSoldSeats,
        availableSeats: () => `capacity - ${updatedSoldSeats}`,
      })
      .where('id = :id', { id: planId })
      .execute();
    // });
  }

  /**
   * Remove plan
   */
  async deletePlan(id: number): Promise<{ message: string; plan: PlanEntity }> {
    let plan = await this.getPlanById(id);
    plan.event = null;
    await this._planRepo.save(plan);
    const deletedPlan = await this._planRepo.remove(plan);
    return {
      message: 'Plan deleted successfully',
      plan: deletedPlan,
    };
  }
}
