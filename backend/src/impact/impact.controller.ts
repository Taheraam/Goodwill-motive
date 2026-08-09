import { Controller, Get, Param } from '@nestjs/common';
import { ImpactService } from './impact.service';

@Controller('impact')
export class ImpactController {
  constructor(private readonly impactService: ImpactService) {}

  @Get('dashboard')
  async dashboard() {
    return this.impactService.getDashboard();
  }

  @Get('campaigns')
  async campaigns() {
    return this.impactService.listCampaigns();
  }

  @Get('campaigns/:id')
  async campaign(@Param('id') id: string) {
    return this.impactService.getCampaign(id);
  }
}