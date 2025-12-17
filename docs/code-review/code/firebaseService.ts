import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously, Auth, User as FirebaseUser } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth: Auth = getAuth(app)
export const db: Firestore = getFirestore(app)
export const storage: FirebaseStorage = getStorage(app)

// 匿名登录初始化
export const initializeAuth = async (): Promise<FirebaseUser | null> => {
  try {
    const result = await signInAnonymously(auth)
    console.log('✅ Firebase 匿名登录成功')
    return result.user
  } catch (error) {
    console.error('❌ Firebase 登录失败:', error)
    return null
  }
}
