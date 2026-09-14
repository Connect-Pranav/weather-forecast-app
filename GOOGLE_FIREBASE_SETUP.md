# Google Login & Firebase Setup Guide

## Step 1: Set Up Firebase Project

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter project name: `WeatherForecastApp`
4. Accept the terms and create

### 1.2 Enable Firebase Services

**Enable Authentication:**
1. Go to "Build" → "Authentication"
2. Click "Get Started"
3. Enable "Google" provider:
   - Click on "Google"
   - Toggle the switch ON
   - Add a support email
   - Save

**Enable Realtime Database:**
1. Go to "Build" → "Realtime Database"
2. Click "Create Database"
3. Choose location closest to you
4. Start in "Test mode" (for development)
5. Create

**Set Database Rules (after creating):**
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

## Step 2: Configure Google OAuth

### 2.1 Get Google Web Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   ```
   http://localhost:3000
   http://localhost:5000
   ```
7. Create and copy the **Client ID**

### 2.2 Add Google Configuration to React Native

For **Android**:
1. Go to Firebase Console → Project Settings
2. Click "Add App" → "Android"
3. Fill in package name (e.g., `com.weatherapp.forecast`)
4. Download `google-services.json`
5. Place in `android/app/` folder

For **iOS**:
1. Click "Add App" → "iOS"
2. Enter bundle ID (e.g., `com.weatherapp.forecast`)
3. Download `GoogleService-Info.plist`
4. Add to Xcode project (Xcode → File → Add Files)

## Step 3: Update App Configuration

### 3.1 Add API Keys to App.js

Open `App.js` and update these constants:

```javascript
// Replace with your OpenWeatherMap API key
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';

// Replace with your Google Web Client ID
const WEB_CLIENT_ID = 'YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com';
```

### 3.2 Get OpenWeatherMap API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for free account
3. Go to API keys section
4. Copy the default API key
5. Paste into `App.js`

## Step 4: Install Dependencies

```bash
npm install
npx react-native link @react-native-firebase/app
npx react-native link @react-native-firebase/auth
npx react-native link @react-native-firebase/database
npx react-native link @react-native-google-signin/google-signin
```

## Step 5: Run the App

### For Android:
```bash
npm run android
```

### For iOS:
```bash
cd ios
pod install
cd ..
npm run ios
```

## Features Added

✅ **Google Sign-In** - Users login with their Google account  
✅ **Auto Gmail Fetch** - Automatically retrieves email and profile info  
✅ **User Profile** - Display user's name, email, and profile picture  
✅ **Firebase Auth** - Secure authentication  
✅ **Realtime Database** - Store user preferences in cloud  
✅ **Location Saving** - Last searched location stored in Firebase  
✅ **Preferences** - Toggle notifications, customize settings  
✅ **Account Info** - View account creation date and stats  

## User Data Structure in Firebase

```
users/
├── {uid}/
│   ├── email: "user@gmail.com"
│   ├── displayName: "John Doe"
│   ├── photoURL: "https://..."
│   ├── createdAt: "2026-09-14T..."
│   └── preferences/
│       ├── unit: "metric"
│       ├── notifications: true
│       └── lastLocation:
│           ├── latitude: 40.7128
│           ├── longitude: -74.0060
│           ├── city: "New York"
│           └── updatedAt: "2026-09-14T..."
```

## Troubleshooting

### "Invalid Client ID"
- Verify Web Client ID is correctly copied
- Check it ends with `.apps.googleusercontent.com`
- Ensure credentials are from Google Cloud Console

### "Firebase Authentication Error"
- Verify Google provider is enabled in Firebase Console
- Check project ID matches in `google-services.json`
- Ensure Realtime Database is created

### "Location Permission Denied"
- Grant permission through device Settings
- For Android: Settings → Apps → Weather App → Permissions → Location

### "User data not saving"
- Check Realtime Database Rules are set correctly
- Verify user is authenticated before saving
- Check Firebase Console for errors

## Security Notes

⚠️ **For Production:**
1. Move API keys to environment variables
2. Enable Firebase security rules (not test mode)
3. Use Firestore instead of Realtime Database
4. Add email verification
5. Implement proper error handling
6. Never commit API keys to version control

## Testing the Integration

1. **Sign In**: Tap "Sign in with Google" on login screen
2. **Select Account**: Choose a Google account
3. **Verify Profile**: Tap profile button (👤) to see user data
4. **Search Weather**: Search a city and check lastLocation in Firebase
5. **Toggle Notifications**: Change notification preference
6. **Sign Out**: Tap sign out button

## Next Steps

- Add email notifications using SendGrid/Gmail API
- Implement favorite locations list
- Add weather sharing via email
- Set up push notifications
- Create admin dashboard in Firebase Console
