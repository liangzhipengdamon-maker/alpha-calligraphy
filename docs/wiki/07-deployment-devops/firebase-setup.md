# Firebase配置

## 🔥 Firebase初始化

### firebaseService.ts

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

// 初始化Firebase
const app = initializeApp(firebaseConfig);

// 获取服务引用
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
```

## 📊 Firestore规则

### 安全规则

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 用户评估数据
    match /evaluations/{userId}/records/{document=**} {
      allow read, write: if request.auth.uid == userId;
    }

    // 反馈数据
    match /feedback/{feedbackId} {
      allow write: if request.auth != null;
      allow read: if request.auth.uid == resource.data.userId;
    }

    // 统计数据（只读）
    match /statistics/{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## 💾 Storage规则

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /evaluations/{userId}/{allPaths=**} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId
                   && request.resource.size < 10 * 1024 * 1024;
    }

    match /evaluations/temp/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

**最后更新**: 2025-12-04
