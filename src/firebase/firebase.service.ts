import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../config/firebase-admin-sdk.json';

@Injectable()
export class FirebaseService {
  private firebaseApp: admin.app.App;
  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase(): void {
    try {
      if (!this.firebaseApp) {
        this.firebaseApp =
          admin.apps.length === 0
            ? admin.initializeApp({
                credential: admin.credential.cert(
                  serviceAccount as admin.ServiceAccount,
                ),
              })
            : admin.app();
      }
    } catch (error) {
      throw new Error(`Firebase initialization failed: ${error.message}`);
    }
  }

  getAuth(): admin.auth.Auth {
    if (!this.firebaseApp) {
      this.initializeFirebase();
    }
    return this.firebaseApp.auth();
  }
}
