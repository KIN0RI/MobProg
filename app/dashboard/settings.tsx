import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function SettingsTab() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const user = await AsyncStorage.getItem('currentUser');
        setCurrentUser(user || '');
      };
      loadUser();
    }, [])
  );

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please complete all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    if (newPassword === currentPassword) {
      Alert.alert('Error', 'New password cannot be the same.');
      return;
    }

    try {
      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : {};

      if (users[currentUser] !== currentPassword) {
        Alert.alert('Incorrect Password', 'Your current password is wrong.');
        return;
      }

      users[currentUser] = newPassword;
      await AsyncStorage.setItem('users', JSON.stringify(users));

      Alert.alert('Success', 'Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Error', 'Unable to change password.');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('currentUser');
    router.replace('/');
  };

  return (
    <ScrollView style={styles.container}>

      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <Animated.View 
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      >

        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account</Text>

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={currentUser}
            editable={false}
          />

          <Text style={styles.label}>Current Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />

          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity style={styles.buttonPrimary} onPress={handleChangePassword}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
        </View>


        
        <View style={styles.logoutBox}>
          <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>

    </ScrollView>
  );
}

const ACCENT = '#1A8F4B';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F6F2' },

  header: {
    backgroundColor: ACCENT,
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignItems: 'center'
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 18,
    marginTop: 18,
    padding: 18,
    borderRadius: 18,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ACCENT,
    marginBottom: 15,
  },

  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },

  disabledInput: {
    backgroundColor: '#e9e9e9',
    color: '#777',
  },

  placeholder: {
    fontSize: 14,
    color: '#666',
    paddingVertical: 6,
  },

  buttonPrimary: {
    backgroundColor: ACCENT,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },

  buttonLogout: {
    backgroundColor: '#C62828',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '60%',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },

  logoutBox: {
    marginTop: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
});
