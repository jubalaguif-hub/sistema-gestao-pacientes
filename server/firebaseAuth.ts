import admin from 'firebase-admin';
import { getUserByFirebaseUid, upsertUser } from './db';
import { User } from '../drizzle/schema';

let firebaseAdmin: admin.app.App | null = null;

export function initializeFirebaseAdmin() {
  if (firebaseAdmin) {
    return firebaseAdmin;
  }

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (!serviceAccount) {
    console.warn('[Firebase Admin] Service account not configured');
    return null;
  }

  try {
    const credentials = JSON.parse(serviceAccount);
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(credentials),
    });
    console.log('[Firebase Admin] Initialized successfully');
    return firebaseAdmin;
  } catch (error) {
    console.error('[Firebase Admin] Failed to initialize:', error);
    return null;
  }
}

export async function verifyFirebaseToken(token: string): Promise<admin.auth.DecodedIdToken | null> {
  const app = initializeFirebaseAdmin();
  
  if (!app) {
    console.warn('[Firebase Auth] Admin not initialized');
    return null;
  }

  try {
    console.log('[Firebase Auth] Verifying token...');
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('[Firebase Auth] Token verified successfully, uid:', decodedToken.uid);
    return decodedToken;
  } catch (error: any) {
    console.error('[Firebase Auth] Token verification failed:', error.message || error);
    return null;
  }
}

export async function authenticateFirebaseUser(token: string): Promise<User | null> {
  console.log('[Firebase Auth] Authenticating user with token...');
  const decodedToken = await verifyFirebaseToken(token);
  
  if (!decodedToken) {
    console.log('[Firebase Auth] Token verification returned null');
    return null;
  }

  const firebaseUid = decodedToken.uid;
  const email = decodedToken.email || '';
  const name = decodedToken.name || email.split('@')[0] || 'Usuário';

  console.log('[Firebase Auth] Looking up user:', firebaseUid);
  // Buscar ou criar usuário no banco
  let user = await getUserByFirebaseUid(firebaseUid);

  if (!user) {
    console.log('[Firebase Auth] User not found, creating new user');
    // Criar novo usuário
    await upsertUser({
      firebaseUid,
      email,
      name,
      role: 'funcionario',
      lastSignedIn: new Date(),
    });
    user = await getUserByFirebaseUid(firebaseUid);
    console.log('[Firebase Auth] User created:', user ? user.email : 'failed');
  } else {
    console.log('[Firebase Auth] User found, updating login');
    // Atualizar último login
    await upsertUser({
      firebaseUid,
      email,
      name,
      lastSignedIn: new Date(),
    });
  }

  console.log('[Firebase Auth] Authentication complete, user:', user ? user.email : 'null');
  return user || null;
}
