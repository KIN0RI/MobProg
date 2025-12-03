import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfileTab() {
  const [currentUser, setCurrentUser] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadUserProfile = async () => {
        const user = await AsyncStorage.getItem('currentUser');
        const adminStatus = await AsyncStorage.getItem('isAdmin');
        setCurrentUser(user || '');
        setIsAdmin(adminStatus === 'true');
      };
      loadUserProfile();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoBox}>
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value}>{currentUser || 'Not logged in'}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Account Type:</Text>
          <Text style={styles.value}>{isAdmin ? 'Administrator' : 'Regular User'}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.value, isAdmin ? styles.adminStatus : styles.userStatus]}>
            {isAdmin ? '✓ Admin Account' : '✓ Active'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Permissions</Text>
        
        <View style={styles.permissionItem}>
          <Text>✓ View own requests</Text>
        </View>
        <View style={styles.permissionItem}>
          <Text>✓ Submit certificate requests</Text>
        </View>
        <View style={styles.permissionItem}>
          <Text>✓ Change password</Text>
        </View>
        {isAdmin && (
          <>
            <View style={styles.permissionItem}>
              <Text>✓ View all requests (Admin)</Text>
            </View>
            <View style={styles.permissionItem}>
              <Text>✓ Manage request status (Admin)</Text>
            </View>
            <View style={styles.permissionItem}>
              <Text>✓ Delete requests (Admin)</Text>
            </View>
            <View style={styles.permissionItem}>
              <Text>✓ Access Account Details (Admin)</Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 20, textAlign: 'center', color: '#000', borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 10 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  infoBox: { 
    backgroundColor: '#f5f5f5', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF'
  },
  label: { fontSize: 12, color: '#666', marginBottom: 5, fontWeight: '600' },
  value: { fontSize: 14, color: '#333', fontWeight: '500' },
  adminStatus: { color: '#007AFF', fontWeight: 'bold' },
  userStatus: { color: 'green', fontWeight: 'bold' },
  permissionItem: { 
    paddingVertical: 10, 
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
});
