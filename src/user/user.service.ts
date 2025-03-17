import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly firebaseService: FirebaseService) {}

  // ✅ Get User Profile
  async getUserProfile(uid: string) {
    try {
      const firestore = this.firebaseService.getFirestore();
      const userDoc = await firestore.collection('users').doc(uid).get();

      if (!userDoc.exists) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'User profile fetched successfully',
        data: userDoc.data(),
      };
    } catch (error) {
      console.error('Get User Profile Error:', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to fetch user profile',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ✅ Update User Profile
  async updateUserProfile(uid: string, updateUserDto: UpdateUserDto) {
    try {
      const firestore = this.firebaseService.getFirestore();
      const userRef = firestore.collection('users').doc(uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      await userRef.update({
        ...updateUserDto,
        modifiedAt: new Date().toISOString(),
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'User profile updated successfully',
        data: (await userRef.get()).data(),
      };
    } catch (error) {
      console.error('Update User Profile Error:', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to update user profile',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ✅ Delete User from Firestore & Firebase Authentication
  async deleteUser(uid: string) {
    try {
      const firestore = this.firebaseService.getFirestore();
      const auth = this.firebaseService.getAuth();

      // Delete user from Firestore
      await firestore.collection('users').doc(uid).delete();

      // Delete user from Firebase Authentication
      await auth.deleteUser(uid);

      return {
        statusCode: HttpStatus.OK,
        message: 'User deleted successfully',
      };
    } catch (error) {
      console.error('Delete User Error:', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to delete user',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
