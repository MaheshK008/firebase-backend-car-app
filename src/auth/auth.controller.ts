import { Post, Body, Controller } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() body: { email: string; password: string }) {
    return this.authService.signup(body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('verify-token')
  async verifyToken(@Body('token') token: string) {
    try {
      const decodedToken = await this.firebaseService
        .getAuth()
        .verifyIdToken(token);
      return { uid: decodedToken.uid, email: decodedToken.email };
    } catch (error) {
      console.log(error);
      throw new Error('Invalid token');
    }
  }

  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
