import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';

interface Request {
  id: string;
  certType: string;
  fullName: string;
  address: string;
  birthdate: string;
  contactNum: string;
  email: string;
  status: string;
  submittedAt: string;
  submittedBy?: string;
}

export default function HomeTab() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const adminStatus = await AsyncStorage.getItem('isAdmin');
        setIsAdmin(adminStatus === 'true');
        
        const storedRequests = await AsyncStorage.getItem('requests');
        if (storedRequests) {
          const allRequests = JSON.parse(storedRequests);
          const isAdminUser = adminStatus === 'true';
          
          if (isAdminUser) {
            setRequests(allRequests);
          } else {
            const currentUser = await AsyncStorage.getItem('currentUser');
            const filteredRequests = allRequests.filter((req: Request) => req.submittedBy === currentUser);
            setRequests(filteredRequests);
          }
        }
      };
      loadData();
    }, [])
  );

  const handleRequestCert = () => {
    router.push('/request');
  };

  const handleRefresh = async () => {
    const adminStatus = await AsyncStorage.getItem('isAdmin');
    setIsAdmin(adminStatus === 'true');
    
    const storedRequests = await AsyncStorage.getItem('requests');
    if (storedRequests) {
      const allRequests = JSON.parse(storedRequests);
      const isAdminUser = adminStatus === 'true';
      
      if (isAdminUser) {
        setRequests(allRequests);
      } else {
        const currentUser = await AsyncStorage.getItem('currentUser');
        const filteredRequests = allRequests.filter((req: Request) => req.submittedBy === currentUser);
        setRequests(filteredRequests);
      }
    }
    Alert.alert('Refreshed', 'Data has been refreshed');
  };

  const handleRemoveRequest = async (id: string) => {
    if (!isAdmin) {
      Alert.alert('Error', 'Only admin can remove requests.');
      return;
    }
    const storedRequests = await AsyncStorage.getItem('requests');
    if (storedRequests) {
      const updatedRequests = JSON.parse(storedRequests).filter((req: Request) => req.id !== id);
      await AsyncStorage.setItem('requests', JSON.stringify(updatedRequests));
      setRequests(updatedRequests);
      Alert.alert('Removed', 'Certificate request has been removed.');
    }
  };

  const handleDoneRequest = async (id: string) => {
    if (!isAdmin) {
      Alert.alert('Error', 'Only admin can mark requests as done.');
      return;
    }
    const storedRequests = await AsyncStorage.getItem('requests');
    if (storedRequests) {
      const updatedRequests = JSON.parse(storedRequests).map((req: Request) =>
        req.id === id ? { ...req, status: 'Done' } : req
      );
      await AsyncStorage.setItem('requests', JSON.stringify(updatedRequests));
      setRequests(updatedRequests);
      Alert.alert('Done', 'Certificate request has been marked as done.');
    }
  };

  const handleReadyToReceiveRequest = async (id: string) => {
    if (!isAdmin) {
      Alert.alert('Error', 'Only admin can mark requests as ready to receive.');
      return;
    }
    const storedRequests = await AsyncStorage.getItem('requests');
    if (storedRequests) {
      const updatedRequests = JSON.parse(storedRequests).map((req: Request) =>
        req.id === id ? { ...req, status: 'Ready to Receive' } : req
      );
      await AsyncStorage.setItem('requests', JSON.stringify(updatedRequests));
      setRequests(updatedRequests);
      Alert.alert('Ready', 'Certificate is ready to receive.');
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      return dateString;
    }
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-');
      return `${month}/${day}/${year}`;
    }
    
    try {
      const date = new Date(dateString);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch {
      return dateString;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Certificate Requests</Text>
      <View style={styles.topButtonContainer}>
        {!isAdmin && <Button title="Request Certificate" onPress={handleRequestCert} />}
        <Button title="Refresh" onPress={handleRefresh} color="purple" />
      </View>
      
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.record}>
            <Text>Certificate: {item.certType}</Text>
            <Text>Name: {item.fullName}</Text>
            {isAdmin && <Text>Address: {item.address}</Text>}
            {isAdmin && <Text>Birthdate: {formatDate(item.birthdate)}</Text>}
            {isAdmin && <Text>Contact: {item.contactNum}</Text>}
            {isAdmin && <Text>Email: {item.email}</Text>}
            {isAdmin && <Text>Submitted By: {item.submittedBy}</Text>}
            <Text style={[styles.statusText, item.status === 'Pending' && styles.statusPending, item.status === 'Ready to Receive' && styles.statusReady, item.status === 'Done' && styles.statusDone]}>
              Status: {item.status}
            </Text>
            <Text>Submitted: {formatDate(item.submittedAt)}</Text>
            {isAdmin && (
              <View style={styles.adminButtonContainer}>
                <View style={styles.buttonSmall}>
                  <Button title="Ready" onPress={() => handleReadyToReceiveRequest(item.id)} color="blue" />
                </View>
                <View style={styles.buttonSmall}>
                  <Button title="Done" onPress={() => handleDoneRequest(item.id)} color="green" />
                </View>
                <View style={styles.buttonSmall}>
                  <Button title="Remove" onPress={() => handleRemoveRequest(item.id)} color="red" />
                </View>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={<Text>No requests yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 15, color: '#000', borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 10, textAlign: 'center' },
  topButtonContainer: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  record: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  statusText: { fontSize: 14 },
  statusPending: { color: 'green', fontWeight: 'bold' },
  statusReady: { color: 'blue', fontWeight: 'bold' },
  statusDone: { color: 'purple', fontWeight: 'bold' },
  adminButtonContainer: { flexDirection: 'row', gap: 10, marginTop: 10 },
  buttonSmall: { flex: 1 },
});
