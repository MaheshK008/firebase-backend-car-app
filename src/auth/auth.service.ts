import { Injectable } from '@nestjs/common';
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Auth,
} from 'firebase/auth';
import * as firebaseConfig from '../../config/firebase-config.json';

@Injectable()
export class AuthService {
  private app: FirebaseApp;
  private auth: Auth;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
  }

  async signup(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password,
    );
    return userCredential.user;
  }

  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password,
    );
    return userCredential.user;
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
        throw new Error(data.error.message || 'Failed to refresh token');
      }

      return {
        accessToken: data.id_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
