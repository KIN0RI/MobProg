import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';

interface StorageData {
  users?: string;
  currentUser?: string;
  isAdmin?: string;
  loggedIn?: string;
  requests?: string;
}

export default function AccountDetailsTab() {
  const [data, setData] = useState<StorageData>({});
  const [currentUserName, setCurrentUserName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const adminStatus = await AsyncStorage.getItem('isAdmin');
      setIsAdmin(adminStatus === 'true');

      // Only load data if admin
      if (adminStatus !== 'true') {
        Alert.alert('Error', 'Access Denied: Admin only');
        return;
      }

      const users = await AsyncStorage.getItem('users');
      const currentUser = await AsyncStorage.getItem('currentUser');
      const loggedIn = await AsyncStorage.getItem('loggedIn');
      const requests = await AsyncStorage.getItem('requests');

      setCurrentUserName(currentUser || '');
      setData({
        users: users || 'No users stored',
        currentUser: currentUser || 'No current user',
        isAdmin: adminStatus || 'Not set',
        loggedIn: loggedIn || 'Not logged in',
        requests: requests || 'No requests',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    }
  };

  const formatJSON = (jsonString: string | undefined) => {
    if (!jsonString) return 'Empty';
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return jsonString;
    }
  };

  const parseUsers = (usersString: string | undefined) => {
    if (!usersString) return [];
    try {
      return Object.keys(JSON.parse(usersString));
    } catch {
      return [];
    }
  };

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Access Denied</Text>
        <Text style={styles.errorText}>This section is for administrators only.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <Text style={styles.profileTitle}>Current User Profile</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Username:</Text>
          <Text style={styles.infoValue}>{currentUserName || 'Not logged in'}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Admin Status:</Text>
          <Text style={[styles.infoValue, data.isAdmin === 'true' ? styles.adminYes : styles.adminNo]}>
            {data.isAdmin === 'true' ? '✓ Admin' : 'Regular User'}
          </Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Login Status:</Text>
          <Text style={styles.infoValue}>{data.loggedIn === 'true' ? 'Logged In' : 'Not Logged In'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Registered Users</Text>
        <Text style={styles.dataText}>
          {parseUsers(data.users).length > 0
            ? parseUsers(data.users).join(', ')
            : 'No users registered'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Users Database</Text>
        <Text style={styles.dataText}>{formatJSON(data.users)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Certificate Requests</Text>
        <Text style={styles.dataText}>{formatJSON(data.requests)}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Refresh" onPress={loadData} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 20, textAlign: 'center', color: '#000', borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 10 },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center', marginTop: 20 },
  profileSection: { backgroundColor: '#f0f8ff', padding: 15, marginBottom: 15, borderRadius: 8, borderWidth: 2, borderColor: '#007AFF' },
  profileTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#007AFF' },
  infoBox: { marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  infoLabel: { fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 3 },
  infoValue: { fontSize: 14, fontWeight: '500', color: '#333' },
  adminYes: { color: 'green', fontWeight: 'bold' },
  adminNo: { color: 'orange' },
  section: { backgroundColor: '#f5f5f5', padding: 12, marginBottom: 12, borderRadius: 6, borderWidth: 1, borderColor: '#ddd' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  dataText: { fontSize: 11, fontFamily: 'monospace', color: '#666', backgroundColor: '#fff', padding: 10, borderRadius: 4, borderWidth: 1, borderColor: '#ddd' },
  buttonContainer: { gap: 10, marginTop: 15, marginBottom: 20 },
});
