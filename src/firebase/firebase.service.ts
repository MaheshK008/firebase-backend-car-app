import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
// import * as serviceAccount from '../../config/firebase-admin-sdk.json';
import serviceAccountJson from '../../config/firebase-admin-sdk.json';

@Injectable()
export class FirebaseService {
  private firebaseApp: admin.app.App;
  private firestore: admin.firestore.Firestore;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase(): void {
    try {
      if (!admin.apps.length) {
        // ✅ Fix: Clone the service account object to avoid read-only errors
        const serviceAccount = JSON.parse(JSON.stringify(serviceAccountJson));

        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(
            serviceAccount as admin.ServiceAccount,
          ),
        });

        this.firestore = this.firebaseApp.firestore();
      } else {
        this.firebaseApp = admin.app();
        this.firestore = this.firebaseApp.firestore();
      }
    } catch (error) {
      throw new Error(`🔥 Firebase initialization failed: ${error.message}`);
    }
  }

  getAuth(): admin.auth.Auth {
    return this.firebaseApp.auth();
  }

  getFirestore(): admin.firestore.Firestore {
    return this.firestore;
  }
}
