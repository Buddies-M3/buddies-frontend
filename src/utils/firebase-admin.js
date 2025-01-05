import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;