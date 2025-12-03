import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password.');
      return;
    }

    try {
      // Check if it's the admin account
      if (username === 'Admin' && password === 'Admin') {
        await AsyncStorage.setItem('loggedIn', 'true');
        await AsyncStorage.setItem('currentUser', 'Admin');
        await AsyncStorage.setItem('isAdmin', 'true');
        router.replace('/dashboard');
        return;
      }

      // Check against stored users
      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : {};
      
      if (users[username] && users[username] === password) {
        await AsyncStorage.setItem('loggedIn', 'true');
        await AsyncStorage.setItem('currentUser', username);
        await AsyncStorage.setItem('isAdmin', 'false');
        router.replace('/dashboard');
      } else {
        Alert.alert('Error', 'Invalid username or password.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login.');
    }
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Civil Registry Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} />
        <Button title="Sign Up" onPress={handleSignup} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  buttonContainer: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
});