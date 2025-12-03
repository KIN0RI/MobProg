import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function RequestScreen() {
  const [certType, setCertType] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [contactNum, setContactNum] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (!certType || !fullName || !address || !birthdate || !contactNum || !email) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Validate phone number (must be 11 digits)
    if (contactNum.length !== 11) {
      Alert.alert('Error', 'Contact number must be 11 digits.');
      return;
    }

    // Validate email (must end with @gmail.com)
    if (!email.endsWith('@gmail.com')) {
      Alert.alert('Error', 'Email must be a Gmail address (@gmail.com).');
      return;
    }

    try {
      // Get current user
      const currentUser = await AsyncStorage.getItem('currentUser');
      
      // Create request object with "pending" status
      const request = {
        id: Date.now().toString(),
        certType,
        fullName,
        address,
        birthdate,
        contactNum,
        email,
        status: 'Pending',
        submittedAt: new Date().toISOString(),
        submittedBy: currentUser,
      };

      // Store locally
      const existingRequests = await AsyncStorage.getItem('requests');
      const requests = existingRequests ? JSON.parse(existingRequests) : [];
      requests.push(request);
      await AsyncStorage.setItem('requests', JSON.stringify(requests));

      Alert.alert('Success', 'Certificate request submitted successfully!');
      // Reset form
      setCertType('');
      setFullName('');
      setAddress('');
      setBirthdate('');
      setContactNum('');
      setEmail('');
      
      // Navigate back to dashboard
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit request.');
      console.error('Submit error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Request Certificate</Text>
      
      <Text style={styles.label}>Certificate Type</Text>
      <Picker
        selectedValue={certType}
        onValueChange={(itemValue) => setCertType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Type" value="" />
        <Picker.Item label="Death Certificate" value="Death Certificate" />
        <Picker.Item label="Marriage Certificate" value="Marriage Certificate" />
        <Picker.Item label="Birth Certificate" value="Birth Certificate" />
        <Picker.Item label="Certificate of No Marriage Record (Cenomar)" value="Cenomar" />
        <Picker.Item label="Certificate of No Death Record (Ceno Death)" value="Ceno Death" />
      </Picker>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter full name"
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter address"
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.label}>Birthdate (MM/DD/YYYY)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 01/15/1990"
        value={birthdate}
        onChangeText={setBirthdate}
      />

      <Text style={styles.label}>Contact Number (11 digits)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 09123456789"
        keyboardType="phone-pad"
        value={contactNum}
        onChangeText={(text) => {
          // Allow only numbers and limit to 11 digits
          const numericText = text.replace(/[^0-9]/g, '');
          if (numericText.length <= 11) {
            setContactNum(numericText);
          }
        }}
        maxLength={11}
      />

      <Text style={styles.label}>Email Address (@gmail.com)</Text>
      <TextInput
        style={styles.input}
        placeholder="example@gmail.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Separated buttons in a row */}
      <View style={styles.buttonContainer}>
        <Button title="Submit Request" onPress={handleSubmit} />
        <View style={styles.buttonSpacer} />
        <Button title="Back to Dashboard" onPress={() => router.back()} />
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, marginTop: 10, marginBottom: 5 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  picker: { borderWidth: 1, marginBottom: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  buttonSpacer: { width: 10 },  // Space between buttons
});