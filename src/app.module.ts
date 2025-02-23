import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseService } from './firebase/firebase.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [FirebaseModule, AuthModule],
  controllers: [AppController, AuthController],
  providers: [AppService, FirebaseService, AuthService],
})
export class AppModule {}
