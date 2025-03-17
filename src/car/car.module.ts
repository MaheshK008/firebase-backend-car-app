import { Module } from '@nestjs/common';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { FirebaseService } from '../firebase/firebase.service';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [CarController],
  providers: [CarService, FirebaseService, AuthService],
})
export class CarModule {}
