import {
  Post,
  Body,
  Controller,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    try {
      const response = await this.authService.signup(signupDto);
      return response;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.response?.message || 'Signup failed',
          error: error.response?.error || error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      return await this.authService.login(body.email, body.password);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.UNAUTHORIZED,
          message: error.response?.message || 'Login failed',
          error: error.response?.error || error.message,
        },
        error.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    try {
      return this.authService.refreshToken(refreshToken);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.UNAUTHORIZED,
          message: error.response?.message || 'Failed to refresh token',
          error: error.response?.error || error.message,
        },
        error.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
