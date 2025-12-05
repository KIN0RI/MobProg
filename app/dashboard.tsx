import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AdminTab from './dashboard/admin';
import HomeTab from './dashboard/home';
import ProfileTab from './dashboard/profile';
import SettingsTab from './dashboard/settings';

const Tab = createBottomTabNavigator();

export default function DashboardScreen() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const checkAdmin = async () => {
        const adminStatus = await AsyncStorage.getItem('isAdmin');
        setIsAdmin(adminStatus === 'true');
      };
      checkAdmin();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>SwiftServe</Text>
        </View>

        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof MaterialIcons.glyphMap = 'home';

              if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'Profile') {
                iconName = 'person';
              } else if (route.name === 'Settings') {
                iconName = 'settings';
              } else if (route.name === 'Admin') {
                iconName = 'admin-panel-settings';
              }

              return <MaterialIcons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabBarLabel,
          })}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeTab}
            options={{ 
              title: 'Home',
              tabBarLabel: 'Home',
            }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileTab}
            options={{ 
              title: 'Profile',
              tabBarLabel: 'Profile',
            }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsTab}
            options={{ 
              title: 'Settings',
              tabBarLabel: 'Settings',
            }}
          />
          {isAdmin && (
            <Tab.Screen 
              name="Admin" 
              component={AdminTab}
              options={{ 
                title: 'Admin',
                tabBarLabel: 'Admin',
              }}
            />
          )}
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { 
    flex: 1, 
    backgroundColor: '#fff'
  },
  container: { 
    flex: 1, 
    backgroundColor: '#fff'
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 30,
    paddingHorizontal: 15,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    flex: 1,
    textAlign: 'center'
  },
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingBottom: 5,
    paddingTop: 5,
    height: 60
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
  }
});