import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateCarDto } from './dto/car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarService {
  constructor(private readonly firebaseService: FirebaseService) {}

  // Create a new car
  async createCar(uid: any, createCarDto: CreateCarDto) {
    try {
      const firestore = this.firebaseService.getFirestore();
      // Create a new document with auto-generated id in "cars" collection.
      const docRef = firestore.collection('cars').doc();
      const carData = {
        id: docRef.id,
        ...createCarDto,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        createdBy: uid,
        modifiedBy: uid,
      };

      await docRef.set(carData);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Car created successfully',
        data: carData,
      };
    } catch (error) {
      console.error('Create Car Error:', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error creating car',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get all cars
  async getAllCars() {
    try {
      const firestore = this.firebaseService.getFirestore();
      const snapshot = await firestore.collection('cars').get();
      const cars = snapshot.docs.map((doc) => doc.data());
      return {
        statusCode: HttpStatus.OK,
        message: 'Cars fetched successfully',
        data: cars,
      };
    } catch (error) {
      console.error('Get All Cars Error:', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error fetching cars',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get a specific car by ID
  async getCarById(id: string) {
    try {
      const firestore = this.firebaseService.getFirestore();
      const docRef = await firestore.collection('cars').doc(id).get();
      if (!docRef.exists) {
        throw new HttpException('Car not found', HttpStatus.NOT_FOUND);
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Car fetched successfully',
        data: docRef.data(),
      };
    } catch (error) {
      console.error('Get Car By ID Error:', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error fetching car',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Update a car
  async updateCar(uid: string, id: string, updateCarDto: UpdateCarDto) {
    try {
      const firestore = this.firebaseService.getFirestore();
      const docRef = firestore.collection('cars').doc(id);
      const carDoc = await docRef.get();
      if (!carDoc.exists) {
        throw new HttpException('Car not found', HttpStatus.NOT_FOUND);
      }
      await docRef.update({
        ...updateCarDto,
        modifiedAt: new Date().toISOString(),
        modifiedBy: uid,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Car updated successfully',
      };
    } catch (error) {
      console.error('Update Car Error:', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error updating car',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Delete a car
  async deleteCar(id: string) {
    try {
      const firestore = this.firebaseService.getFirestore();
      const docRef = firestore.collection('cars').doc(id);
      const carDoc = await docRef.get();
      if (!carDoc.exists) {
        throw new HttpException('Car not found', HttpStatus.NOT_FOUND);
      }
      await docRef.delete();
      return {
        statusCode: HttpStatus.OK,
        message: 'Car deleted successfully',
      };
    } catch (error) {
      console.error('Delete Car Error:', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error deleting car',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
