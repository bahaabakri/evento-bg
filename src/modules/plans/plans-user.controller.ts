import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlansService } from './plans.service';

@Controller('plans')
export class PlansUserController {
  constructor(private readonly plansService: PlansService) {}

}