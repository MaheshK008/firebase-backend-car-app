import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ✅ Get User Profile
  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@Request() req) {
    return this.userService.getUserProfile(req.user.uid);
  }

  // ✅ Update User Profile
  @Put('update')
  @UseGuards(AuthGuard)
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUserProfile(req.user.uid, updateUserDto);
  }

  // ✅ Delete User (from Firestore & Firebase Auth)
  @Delete('delete')
  @UseGuards(AuthGuard)
  async deleteUser(@Request() req) {
    return this.userService.deleteUser(req.user.uid);
  }
}
