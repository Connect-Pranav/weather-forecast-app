# Firebase Configuration Template

Copy this file and fill in your actual values from Firebase Console and Google Cloud Console.

```javascript
// firebase.config.js
export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  databaseURL: "https://your-project-id.firebasedatabase.app",
};

export const googleConfig = {
  webClientId: "YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com",
  iosClientId: "YOUR_GOOGLE_IOS_CLIENT_ID.apps.googleusercontent.com",
  androidClientId: "YOUR_GOOGLE_ANDROID_CLIENT_ID.apps.googleusercontent.com",
};

export const weatherConfig = {
  openWeatherMapApiKey: "YOUR_OPENWEATHERMAP_API_KEY",
};
```

## How to Find These Values

### Firebase Config Values
1. Go to Firebase Console → Project Settings
2. Under "Your apps" section, select your app
3. Click "Config" button
4. Copy the config object values

### Google Web Client ID
1. Go to Google Cloud Console
2. Navigate to APIs & Services → Credentials
3. Find your OAuth 2.0 Client ID (Web application)
4. Copy the Client ID

### Google iOS Client ID
1. In Google Cloud Console → Credentials
2. Find your OAuth 2.0 Client ID (iOS)
3. Copy the Client ID

### Google Android Client ID
1. In Google Cloud Console → Credentials
2. Find your OAuth 2.0 Client ID (Android)
3. Copy the Client ID

### OpenWeatherMap API Key
1. Go to OpenWeatherMap → Account Settings
2. Find API Keys section
3. Copy your API key

## Usage in App.js

```javascript
import {
  firebaseConfig,
  googleConfig,
  weatherConfig
} from './firebase.config';

const API_KEY = weatherConfig.openWeatherMapApiKey;
const WEB_CLIENT_ID = googleConfig.webClientId;
```

## Security Best Practices

⚠️ **NEVER commit this file with real values to Git!**

Instead:
1. Add `firebase.config.js` to `.gitignore`
2. Create `firebase.config.example.js` with placeholder values
3. Use environment variables in production
4. Use CI/CD secrets for deployment
