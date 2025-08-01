# Firebase Setup Instructions

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "idea-wall")
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project, go to **Authentication** > **Sign-in method**
2. Click on **Google** provider
3. Toggle "Enable"
4. Add your email as a test user
5. Click "Save"

## 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

## 4. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click "Web app" icon (`</>`)
4. Register your app with a name (e.g., "idea-wall-web")
5. Copy the `firebaseConfig` object

## 5. Set Up Environment Variables

1. Create a file called `.env.local` in your project root
2. Add the following variables with your Firebase config values:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 6. Configure Firestore Security Rules (Optional)

For production, update your Firestore rules to secure user data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own notes
    match /notes/{noteId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 7. Test the Integration

1. Start your development server: `npm run dev`
2. Click "Sign in with Google" in the top-right corner
3. Create some notes
4. Sign out and sign back in - your notes should persist!
5. Try accessing from another device with the same Google account

## Features Implemented

✅ **Google Authentication** - Sign in/out with Google account  
✅ **Real-time Sync** - Notes sync automatically across devices  
✅ **Offline Support** - Works offline, syncs when back online  
✅ **Visual Sync Status** - See sync status in bottom-left corner  
✅ **Secure Storage** - Notes are private to each user  

## Troubleshooting

- **"Firebase not configured"**: Make sure `.env.local` exists with correct values
- **"Auth domain not authorized"**: Add your domain to Firebase Auth settings
- **Notes not syncing**: Check browser console for errors and Firebase rules
