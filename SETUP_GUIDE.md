# Quick Start Guide

## Step-by-Step Setup

### Step 1: Install Node.js
Download and install Node.js from https://nodejs.org/ (v16 or higher)

### Step 2: Get Your OpenWeatherMap API Key
1. Go to https://openweathermap.org/api
2. Sign up for a free account
3. Click on "API keys" in your account settings
4. Copy your default API key

### Step 3: Configure the API Key
Open `App.js` and replace this line:
```javascript
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
```

With your actual API key:
```javascript
const API_KEY = 'abc123def456...'; // Your actual key
```

### Step 4: Install Dependencies
Open terminal/command prompt in the project folder and run:
```bash
npm install
```

This will install all required packages (takes 2-3 minutes)

### Step 5: Run on Android or iOS

#### For Android:
```bash
npm run android
```
Requirements:
- Android Studio installed
- Android emulator running or physical device connected

#### For iOS:
```bash
npm run ios
```
Requirements:
- Xcode installed
- Mac computer

### Step 6: Grant Location Permission
When the app starts:
- **Android**: Tap "OK" when prompted for location permission
- **iOS**: Tap "Allow" when prompted

## Features Overview

📍 **Auto Location Detection**
- App automatically detects your location on startup
- Fetches weather for your current location

🔍 **Search Cities**
- Tap the search button (🔍) in the header
- Type any city name and press search
- Weather updates for that location

📊 **Current Weather Details**
- Large temperature display
- Weather condition and icon
- Feels-like temperature
- Humidity, wind speed, pressure, visibility
- Sunrise and sunset times

⏰ **Hourly Forecast**
- Scroll horizontally to see next 24 hours
- Time and temperature for each hour
- Humidity and wind speed
- Rain probability percentage

## Common Issues & Solutions

### "Cannot find module 'axios'"
```bash
npm install axios
```

### "Location permission denied"
- Go to Settings → Apps → Weather App → Permissions → Location → Allow

### "API key not working"
- Make sure API key is correctly copied (no extra spaces)
- Wait a few minutes after creating the API key on OpenWeatherMap
- Check that free tier API is being used

### App crashes on startup
- Check the API key format in App.js
- Ensure you're connected to internet
- Check console logs for error details

### Metro bundler issues
```bash
npx react-native start --reset-cache
```

## File Structure Explained

```
weather-forecast-app/
├── App.js                    # Main app logic
├── index.js                  # Entry point
├── app.json                  # App name & config
├── package.json              # All dependencies
├── components/
│   ├── CurrentWeather.js    # Shows current temp & details
│   ├── HourlyForecast.js    # Shows hourly cards
│   └── LocationSearch.js    # Search input bar
└── README.md                 # Full documentation
```

## What Data is Used?

The app uses the free OpenWeatherMap API tier which includes:
- Current weather for any location
- 5-day forecast with 3-hour intervals
- Latitude/Longitude to city name conversion
- No subscription required

## Next Steps

1. **Customize Colors**: Edit the color codes in component StyleSheets
2. **Add More Features**: 
   - Extended 7-day forecast
   - Favorite cities list
   - Unit preference (Celsius/Fahrenheit)
3. **Deploy**: Build release versions for app stores

## Need Help?

- React Native Docs: https://reactnative.dev/docs
- OpenWeatherMap API: https://openweathermap.org/api
- Project README.md: See detailed documentation
