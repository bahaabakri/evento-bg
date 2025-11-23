import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import Serialize from '@/decorators/serialize.decorator';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { PlanResponseDto } from './dto/response/plan-response.dto';
import {  CreateUpdatePlanDto } from './dto/request/create-update-plan.dto';
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
  async createPlan(@Body() planData: CreateUpdatePlanDto) {
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

  @Serialize(PlanResponseDto)
  @Permissions('update_plans')
  @Patch(':id')
  @ApiOperation({ summary: 'Update Plan' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Plan ID' })
  async updatePlan(
    @Param('id') id: number,
    @Body() planData: CreateUpdatePlanDto,
  ) {
    return this.plansService.updatePlan(id, planData);
  }

  @Serialize(PlanResponseDto)
  @Permissions('delete_plans')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Plan' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Plan ID' })
  async deletePlan(@Param('id') id: number) {
    return this.plansService.deletePlan(id);
  }
}
