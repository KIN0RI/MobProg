import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Prevent splash screen from hiding automatically
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    const checkLogin = async () => {
      const loggedIn = await AsyncStorage.getItem('loggedIn');
      setIsLoggedIn(loggedIn === 'true');

      // Wait for 5 seconds before marking the app as ready
      setTimeout(() => {
        setIsReady(true);
      }, 5000); // 5 seconds delay
    };
    checkLogin();
  }, []);

  // Hide the splash screen when the app is ready
  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  // If the app is not ready, show the custom splash screen with text and a loading spinner
  if (!isReady) {
    return (
      <View style={styles.splashContainer}>
        <Text style={styles.splashText}>Civil Registry App</Text>
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      </View>
    );
  }

  // If not logged in, show login screen; else, show dashboard
  return <Slot />;
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Splash screen background color
  },
  splashText: {
    fontSize: 30, // Larger font size for a more impactful look
    fontWeight: 'bold', // Bold text
    color: '#010101ff', // A vibrant green color
    letterSpacing: 3, // Increase letter spacing for a wider look
    marginBottom: 20, // Space between text and loader
  },
  loader: {
    marginTop: 20, // Space between text and loader
  },
});