import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/users.dto';
import { Public } from '../auth/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get('leaderboard')
  async getLeaderboard() {
    return this.usersService.getLeaderboard();
  }

  @Get(':id')
  async getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @Patch(':id')
  async updateProfile(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
    @CurrentUser('sub') currentUserId: string,
  ) {
    // Only allow users to update their own profile
    if (currentUserId !== id) {
      return { message: 'You can only update your own profile' };
    }
    return this.usersService.updateProfile(id, dto);
  }

  @Get(':id/stats')
  async getStats(@Param('id') id: string) {
    return this.usersService.getStats(id);
  }
}