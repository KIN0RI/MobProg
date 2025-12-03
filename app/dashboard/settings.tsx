import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function SettingsTab() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const router = useRouter();

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
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Error', 'New password must be different from current password.');
      return;
    }

    try {
      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : {};

      if (users[currentUser] !== currentPassword) {
        Alert.alert('Error', 'Current password is incorrect.');
        return;
      }

      users[currentUser] = newPassword;
      await AsyncStorage.setItem('users', JSON.stringify(users));

      Alert.alert('Success', 'Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Error', 'Failed to change password.');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('loggedIn');
    router.replace('/');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          placeholder="Username"
          value={currentUser}
          editable={false}
        />

        <Text style={styles.label}>Current Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter current password"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />

        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <Text style={styles.label}>Confirm New Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm new password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Button title="Change Password" onPress={handleChangePassword} color="green" />
      </View>

      <View style={styles.logoutSection}>
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 20, textAlign: 'center', color: '#000', borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 10 },
  section: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 8, marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#666' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, marginBottom: 15, borderRadius: 5, backgroundColor: '#fff' },
  disabledInput: { backgroundColor: '#e8e8e8', color: '#999' },
  logoutSection: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center'
  },
});
