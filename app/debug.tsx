import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';

interface StorageData {
  users?: string;
  currentUser?: string;
  isAdmin?: string;
  loggedIn?: string;
  requests?: string;
}

export default function AccountDetailsScreen() {
  const [data, setData] = useState<StorageData>({});
  const [currentUserName, setCurrentUserName] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const users = await AsyncStorage.getItem('users');
      const currentUser = await AsyncStorage.getItem('currentUser');
      const isAdmin = await AsyncStorage.getItem('isAdmin');
      const loggedIn = await AsyncStorage.getItem('loggedIn');
      const requests = await AsyncStorage.getItem('requests');

      setCurrentUserName(currentUser || '');
      setData({
        users: users || 'No users stored',
        currentUser: currentUser || 'No current user',
        isAdmin: isAdmin || 'Not set',
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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Account Details</Text>

      <View style={styles.profileSection}>
        <Text style={styles.profileTitle}>Current User Profile</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Username:</Text>
          <Text style={styles.infoValue}>{currentUserName || 'Not logged in'}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Admin Status:</Text>
          <Text style={[styles.infoValue, data.isAdmin === 'true' ? styles.adminYes : styles.adminNo]}>
            {data.isAdmin === 'true' ? 'Admin' : 'Regular User'}
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
        <Button title="Back" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  profileSection: { backgroundColor: '#fff', padding: 20, marginBottom: 15, borderRadius: 8, borderWidth: 2, borderColor: '#007AFF' },
  profileTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#007AFF' },
  infoBox: { marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  infoLabel: { fontSize: 14, fontWeight: '600', color: '#666', marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: '500', color: '#333' },
  adminYes: { color: 'green', fontWeight: 'bold' },
  adminNo: { color: 'orange' },
  section: { backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  dataText: { fontSize: 12, fontFamily: 'monospace', color: '#666', backgroundColor: '#f9f9f9', padding: 10, borderRadius: 4 },
  buttonContainer: { gap: 10, marginTop: 20, marginBottom: 30 },
});
