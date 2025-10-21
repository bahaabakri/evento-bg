import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import Serialize from '@/decorators/serialize.decorator';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { PlanResponseDto } from './dto/response/plan-response.dto';
import { CreatePlanDto } from './dto/request/create-plan.dto';
import { PaginatedPlansDto } from './dto/response/paginated-plans.dto';
import { SearchPlanDto } from './dto/request/search-plan.dto';
import { PlanDto } from './dto/response/plan.dto';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';
import { Permissions } from '../permissions/decorators/permissions.decorator';

@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('admin/plans')
export class PlansAdminController {
  constructor(private readonly plansService: PlansService) {}
  @Serialize(PlanResponseDto)
  @Permissions('create_plans')
  @Post()
  @ApiOperation({ summary: 'Create Plan' })
  async createPlan(@Body() planData: CreatePlanDto) {
    return this.plansService.createPlan(planData);
  }

  @Serialize(PaginatedPlansDto)
  @Permissions('view_plans')
  @Get()
  @ApiOperation({ summary: 'Get Plans for specific event' })
  async getEventPlans(@Query() query: SearchPlanDto) {
    return this.plansService.getEventPlans(query);
  }

  @Serialize(PlanDto)
  @Permissions('view_plans')
  @Get(':id')
  @ApiOperation({ summary: 'Get Plan by id' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Plan ID' })
  async getPlanById(@Param('id') id: number) {
    return this.plansService.getPlanById(id);
  }
}
