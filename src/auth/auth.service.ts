import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, Auth } from 'firebase/auth';
import { FirebaseService } from '../firebase/firebase.service';
import * as firebaseConfig from '../../config/firebase-config.json';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  private app: FirebaseApp;
  private auth: Auth;

  constructor(private readonly firebaseService: FirebaseService) {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
  }

  async signup(signupDto: SignupDto) {
    try {
      const { name, mobile, email, password } = signupDto;
      const auth = this.firebaseService.getAuth();
      const firestore = this.firebaseService.getFirestore();

      // ✅ Check if the email already exists
      const existingUser = await auth.getUserByEmail(email).catch(() => null);
      if (existingUser) {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }

      // ✅ Create user in Firebase Authentication
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: name,
      });

      const uid = userRecord.uid;

      // ✅ Store user details in Firestore
      await firestore.collection('users').doc(uid).set({
        uid,
        name,
        email,
        mobile,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'User registered successfully',
        data: {
          uid,
          name,
          email,
          mobile,
        },
      };
    } catch (error) {
      console.error('Signup Error:', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error during signup',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      const user = userCredential.user;
      const token = await user.getIdToken(true);
      const refreshToken = user.refreshToken;
      const firestore = this.firebaseService.getFirestore();
      const userInfo = await firestore.collection('users').doc(user.uid).get();

      return {
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        data: {
          uid: user.uid,
          ...userInfo.data(),
          accessToken: token,
          refreshToken,
        },
      };
    } catch (error) {
      console.error('Login Error:', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid email or password',
          error: error.message,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const response = await fetch(
        `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to refresh token');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Token refreshed successfully',
        data: {
          accessToken: data.id_token,
          refreshToken: data.refresh_token,
          expiresIn: data.expires_in, // Time in seconds
        },
      };
    } catch (error) {
      console.error('Refresh Token Error:', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Failed to refresh token',
          error: error.message,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
