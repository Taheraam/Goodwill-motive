import { Controller, Get, Param, Query } from '@nestjs/common';
import { ImpactService } from './impact.service';
import { Public } from '../auth/public.decorator';

@Controller('impact')
export class ImpactController {
  constructor(private readonly impactService: ImpactService) {}

  @Public()
  @Get('dashboard')
  async dashboard() {
    return this.impactService.getDashboard();
  }

  @Public()
  @Get('campaigns')
  async campaigns(@Query('take') take?: string) {
    return this.impactService.listCampaigns(take ? parseInt(take, 10) : 50);
  }

  @Public()
  @Get('campaigns/:id')
  async campaign(@Param('id') id: string) {
    return this.impactService.getCampaign(id);
  }
}