import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FirebaseService } from '../firebase/firebase.service';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  controllers: [UserController],
  providers: [UserService, FirebaseService, AuthGuard],
})
export class UserModule {}
