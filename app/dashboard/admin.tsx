import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

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

  // Animation refs
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
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const adminStatus = await AsyncStorage.getItem('isAdmin');
      setIsAdmin(adminStatus === 'true');

      if (adminStatus !== 'true') {
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

  // ACCESS DENIED SCREEN (also animated)
  if (!isAdmin) {
    return (
      <Animated.View style={[styles.centered, {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }]}>
        <Text style={styles.accessDeniedTitle}>Access Denied</Text>
        <Text style={styles.accessDeniedText}>
          This section is limited to administrators only.
        </Text>
      </Animated.View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <Text style={styles.pageTitle}>Administrator Panel</Text>

        {/* PROFILE SECTION */}
        <View style={styles.profileSection}>
          <Text style={styles.sectionHeader}>Current Account</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Username:</Text>
            <Text style={styles.value}>{currentUserName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Admin Status:</Text>
            <Text style={[styles.value, styles.adminBadge]}>
              ✓ Administrator
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Login Status:</Text>
            <Text style={styles.value}>
              {data.loggedIn === 'true' ? 'Logged In' : 'Not Logged In'}
            </Text>
          </View>
        </View>

        {/* USERS LIST */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader2}>All Registered Users</Text>
          <Text style={styles.jsonText}>
            {parseUsers(data.users).length > 0
              ? parseUsers(data.users).join(', ')
              : 'No users found'}
          </Text>
        </View>

        {/* USERS JSON */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader2}>Users Database</Text>
          <Text style={styles.jsonBox}>{formatJSON(data.users)}</Text>
        </View>

        {/* REQUESTS JSON */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader2}>Certificate Requests</Text>
          <Text style={styles.jsonBox}>{formatJSON(data.requests)}</Text>
        </View>

        {/* REFRESH BUTTON */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.refreshButton} onPress={loadData}>
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FB', padding: 15 },

  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 15,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F4F7FB',
  },

  accessDeniedTitle: {
    fontSize: 22,
    color: '#D32F2F',
    fontWeight: '700',
    marginBottom: 10,
  },

  accessDeniedText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    maxWidth: 280,
  },

  profileSection: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#1E88E5',
    elevation: 2,
  },

  section: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },

  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1E88E5',
  },

  sectionHeader2: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },

  row: {
    marginBottom: 10,
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },

  adminBadge: {
    color: 'green',
    fontWeight: '800',
  },

  jsonBox: {
    fontSize: 11,
    fontFamily: 'monospace',
    padding: 10,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    color: '#444',
  },

  jsonText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#444',
    padding: 8,
    backgroundColor: '#E9EEF5',
    borderRadius: 6,
  },

  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },

  refreshButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },

  refreshText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
