import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HourlyForecast from './components/HourlyForecast';
import CurrentWeather from './components/CurrentWeather';
import LocationSearch from './components/LocationSearch';
import UserProfile from './components/UserProfile';
import { getYourWeather, getAllYourCities } from './yourWeatherData';

const WEB_CLIENT_ID = 'YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com'; // Replace with your Google Web Client ID

export default function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Auth & User states
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  // Initialize Google Sign-In
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  // Initialize Firebase Auth
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  // Load weather on user login
  useEffect(() => {
    if (user) {
      loadDefaultWeather();
    }
  }, [user]);

  const configureGoogleSignIn = async () => {
    try {
      GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID,
        offlineAccess: true,
        forceCodeForRefreshToken: true,
        scopes: ['profile', 'email'],
      });
    } catch (error) {
      console.error('Error configuring Google Sign-In:', error);
    }
  };

  const onAuthStateChanged = (user) => {
    if (user) {
      setUser(user);
      fetchUserProfile(user.uid);
    } else {
      setUser(null);
      setUserProfile(null);
    }
    if (initializing) setInitializing(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      const credential = auth.GoogleAuthProvider.credential(response.data.idToken);
      await auth().signInWithCredential(credential);

      Alert.alert('Success', `Welcome ${response.data.user.name}!`);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing in...');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services not available');
      } else {
        console.error('Google Sign-In Error:', error);
        Alert.alert('Error', 'Failed to sign in with Google');
      }
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await auth().signOut();
      setUserProfile(null);
      setShowProfile(false);
      Alert.alert('Success', 'Signed out successfully');
    } catch (error) {
      console.error('Sign-out Error:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const fetchUserProfile = async (uid) => {
    try {
      const userRef = database().ref(`users/${uid}`);
      userRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
          setUserProfile(snapshot.val());
        } else {
          // Create new user profile
          const newProfile = {
            email: auth().currentUser?.email,
            displayName: auth().currentUser?.displayName,
            photoURL: auth().currentUser?.photoURL,
            createdAt: new Date().toISOString(),
            preferences: {
              unit: 'metric',
              notifications: true,
              lastLocation: null,
            },
          };
          userRef.set(newProfile);
          setUserProfile(newProfile);
        }
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const updateUserPreferences = async (preferences) => {
    try {
      if (user) {
        await database().ref(`users/${user.uid}/preferences`).update(preferences);
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  // Load weather from mock data
  const loadDefaultWeather = () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate a small delay like loading data
      setTimeout(() => {
        const weatherData = getYourWeather('London');
        setCurrentWeather(weatherData.current_conditions);
        setHourlyForecast(weatherData.hourly_forecast);
        setLocation({
          latitude: weatherData.coordinates.latitude,
          longitude: weatherData.coordinates.longitude,
          name: weatherData.name,
        });

        // Save to async storage
        AsyncStorage.setItem(
          'lastWeather',
          JSON.stringify({
            current: weatherData.current,
            hourly: weatherData.hourly,
            location: weatherData.name,
          })
        );

        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to load weather data');
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (cityName) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      setTimeout(() => {
        const weatherData = getYourWeather(cityName);

        if (!weatherData) {
          setError('City not found');
          setLoading(false);
          return;
        }

        setCurrentWeather(weatherData.current_conditions);
        setHourlyForecast(weatherData.hourly_forecast);
        setLocation({
          latitude: weatherData.coordinates.latitude,
          longitude: weatherData.coordinates.longitude,
          name: weatherData.name,
        });

        // Save to async storage
        AsyncStorage.setItem(
          'lastWeather',
          JSON.stringify({
            current: weatherData.current_conditions,
            hourly: weatherData.hourly_forecast,
            location: weatherData.name,
          })
        );

        // Update user's last location in Firebase
        if (user) {
          updateUserPreferences({
            lastLocation: {
              latitude: weatherData.coordinates.latitude,
              longitude: weatherData.coordinates.longitude,
              city: weatherData.name,
              updatedAt: new Date().toISOString(),
            },
          });
        }

        setLoading(false);
      }, 300);
    } catch (err) {
      setError('Failed to load weather data');
      setLoading(false);
    }
  };

  const handleSearch = (city) => {
    if (city.trim()) {
      fetchWeatherByCity(city);
      setSearchQuery('');
      setSearchActive(false);
    }
  };

  // Show loading screen while initializing auth
  if (initializing) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#00d4ff" />
          <Text style={styles.loadingText}>Initializing...</Text>
        </View>
      </View>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        <View style={styles.loginContainer}>
          <Text style={styles.appTitle}>🌤️ Weather Forecast</Text>
          <Text style={styles.tagline}>Sign in to personalize your experience</Text>

          <TouchableOpacity
            style={styles.googleSignInButton}
            onPress={handleGoogleSignIn}
          >
            <Text style={styles.googleSignInText}>🔐 Sign in with Google</Text>
          </TouchableOpacity>

          <Text style={styles.loginInfo}>
            By signing in, you can{'\n'}
            • Save your favorite locations{'\n'}
            • Get personalized weather alerts{'\n'}
            • Sync across devices
          </Text>

          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Demo Cities Available:</Text>
            <Text style={styles.demoText}>
              🌍 London, New York, Tokyo{'\n'}
              Paris, Sydney, Dubai
            </Text>
            <Text style={styles.demoNote}>
              (Sign in with Google to save preferences)
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Show profile screen
  if (showProfile) {
    return (
      <UserProfile
        user={user}
        userProfile={userProfile}
        onClose={() => setShowProfile(false)}
        onSignOut={handleGoogleSignOut}
        onUpdatePreferences={updateUserPreferences}
      />
    );
  }

  // Main weather app (logged in)
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Weather Forecast</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setSearchActive(!searchActive)}
          >
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => setShowProfile(true)}
          >
            <Text style={styles.profileButtonText}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      {searchActive && (
        <LocationSearch
          onSearch={handleSearch}
          onClose={() => setSearchActive(false)}
          availableCities={getAllYourCities()}
        />
      )}

      {/* Loading State */}
      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#00d4ff" />
          <Text style={styles.loadingText}>Loading weather data...</Text>
        </View>
      )}

      {/* Error State */}
      {error && !loading && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadDefaultWeather}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {currentWeather && (
            <CurrentWeather weather={currentWeather} location={location} />
          )}

          {hourlyForecast.length > 0 && (
            <View style={styles.forecastSection}>
              <Text style={styles.sectionTitle}>Hourly Forecast</Text>
              <HourlyForecast forecast={hourlyForecast} />
            </View>
          )}

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>📍 Your Available Cities:</Text>
            <Text style={styles.infoText}>
              {getAllYourCities().join(', ')}
            </Text>
            <Text style={styles.infoNote}>
              Search any city above to see your weather data
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#e0e0e0',
    marginTop: 12,
    fontSize: 16,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#1a1a2e',
  },
  appTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 12,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#b0b0b0',
    marginBottom: 40,
    textAlign: 'center',
  },
  googleSignInButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  googleSignInText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginInfo: {
    color: '#b0b0b0',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  demoBox: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#0f3460',
    marginTop: 20,
  },
  demoTitle: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  demoText: {
    color: '#e0e0e0',
    fontSize: 13,
    marginBottom: 8,
  },
  demoNote: {
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#16213e',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00d4ff',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  searchButton: {
    padding: 8,
  },
  searchButtonText: {
    fontSize: 20,
  },
  profileButton: {
    padding: 8,
  },
  profileButtonText: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#00d4ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forecastSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 12,
  },
  infoBox: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  infoTitle: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    color: '#e0e0e0',
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 20,
  },
  infoNote: {
    color: '#666',
    fontSize: 12,
  },
});
