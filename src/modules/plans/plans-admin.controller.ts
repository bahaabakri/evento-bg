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
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';
import { Role } from '../users/roles.enum';
import { PlanResponseDto } from './dto/response/plan-response.dto';
import { CreatePlanDto } from './dto/request/create-plan.dto';
import { PaginatedPlansDto } from './dto/response/paginated-plans.dto';
import { SearchPlanDto } from './dto/request/search-plan.dto';
import { PlanDto } from './dto/response/plan.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('admin/plans')
export class PlansAdminController {
  constructor(private readonly plansService: PlansService) {}
  @Serialize(PlanResponseDto)
  @UseGuards(RolesGuard)
  @Roles(Role.MODERATOR)
  @Post()
  @ApiOperation({ summary: 'Create Plan' })
  async createPlan(@Body() planData: CreatePlanDto) {
    return this.plansService.createPlan(planData);
  }

  @Serialize(PaginatedPlansDto)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get Plans for specific event' })
  async getEventPlans(@Query() query: SearchPlanDto) {
    return this.plansService.getEventPlans(query);
  }

  @Serialize(PlanDto)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get Plan by id' })
  @ApiParam({ name: 'id', type: Number, example: 42, description: 'Plan ID' })
  async getPlanById(@Param('id') id: number) {
    return this.plansService.getPlanById(id);
  }
}
