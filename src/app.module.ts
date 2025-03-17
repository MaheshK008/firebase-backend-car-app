import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseService } from './firebase/firebase.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthGuard } from './auth/auth.guard';
import { CarModule } from './car/car.module';

@Module({
  imports: [FirebaseModule, AuthModule, UserModule, CarModule],
  controllers: [AppController, AuthController],
  providers: [AppService, FirebaseService, AuthService, AuthGuard],
})
export class AppModule {}
