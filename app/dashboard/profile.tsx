import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function ProfileTab() {
  const [currentUser, setCurrentUser] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

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

  const handleLogout = async () => {
    await AsyncStorage.removeItem('currentUser');
    await AsyncStorage.removeItem('isAdmin');
    router.replace('/');
  };

  return (
    <ScrollView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>

        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{currentUser || 'Guest User'}</Text>
        <Text style={styles.role}>{isAdmin ? 'Administrator' : 'Regular User'}</Text>
      </View>

      {/* ACCOUNT CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{currentUser || 'Not logged in'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Account Type</Text>
          <Text style={styles.value}>{isAdmin ? 'Administrator' : 'Regular User'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Status</Text>
          <Text style={[styles.value, styles.status]}>
            {isAdmin ? '✓ Admin Account' : '✓ Active User'}
          </Text>
        </View>


      </View>

      {/* PERMISSIONS CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Permissions</Text>

        <Text style={styles.permission}>• View own requests</Text>
        <Text style={styles.permission}>• Submit certificate requests</Text>
        <Text style={styles.permission}>• Change password</Text>

        {isAdmin && (
          <>
            <Text style={styles.permission}>• View all requests (Admin)</Text>
            <Text style={styles.permission}>• Update request status (Admin)</Text>
            <Text style={styles.permission}>• Delete requests (Admin)</Text>
            <Text style={styles.permission}>• Access account details (Admin)</Text>
          </>
        )}
      </View>


    </ScrollView>
  );
}

const ACCENT = '#1A8F4B';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F7F3',
  },

  /* HEADER */
  header: {
    backgroundColor: ACCENT,
    paddingVertical: 45,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    alignItems: 'center',
    elevation: 5,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
    marginBottom: 10,
  },

  username: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },

  role: {
    fontSize: 14,
    color: '#E0FFE9',
    marginTop: 4,
  },

  /* CARD */
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

  infoRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  label: {
    fontSize: 12,
    color: '#777',
    fontWeight: '600',
  },

  value: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },

  status: {
    color: ACCENT,
  },

  permission: {
    fontSize: 15,
    paddingVertical: 6,
    color: '#444',
  },

  editBtn: {
    marginTop: 15,
    backgroundColor: ACCENT,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  editBtnText: {
    color: '#fff',
    fontWeight: '700',
  },


  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
