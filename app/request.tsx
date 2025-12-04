import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function RequestScreen() {
  const router = useRouter();

  // FORM STATES
  const [certType, setCertType] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [contactNum, setContactNum] = useState("");
  const [email, setEmail] = useState("");

  // For date picker
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);

    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      setBirthdate(formatted);
    }
  };

  const handleSubmit = async () => {
    if (!certType || !fullName || !address) {
      Alert.alert("Missing Fields", "Please fill out all required fields.");
      return;
    }

    const newRequest = {
      id: Date.now().toString(),
      certType,
      fullName,
      address,
      birthdate,
      contactNum,
      email,
      submittedAt: new Date().toISOString(),
      status: "Pending",
      submittedBy: fullName,
    };

    // Save to "requests"
    const stored = await AsyncStorage.getItem("requests");
    const parsed = stored ? JSON.parse(stored) : [];

    parsed.push(newRequest);
    await AsyncStorage.setItem("requests", JSON.stringify(parsed));

    Alert.alert("Success", "Your request has been submitted.");
    router.push("/dashboard/home");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Request a Certificate</Text>

      <View style={styles.card}>

        {/* CERTIFICATE TYPE */}
        <Text style={styles.label}>Certificate Type*</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={certType}
            onValueChange={(itemValue) => setCertType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Type" value="" />
            <Picker.Item label="Death Certificate" value="Death Certificate" />
            <Picker.Item label="Marriage Certificate" value="Marriage Certificate" />
            <Picker.Item label="Birth Certificate" value="Birth Certificate" />
            <Picker.Item 
              label="Certificate of No Marriage Record (Cenomar)" 
              value="Cenomar" 
            />
            <Picker.Item 
              label="Certificate of No Death Record (Ceno Death)" 
              value="Ceno Death" 
            />
          </Picker>
        </View>

        {/* FULL NAME */}
        <Text style={styles.label}>Full Name*</Text>
        <TextInput
          style={styles.input}
          placeholder="Your full name"
          value={fullName}
          onChangeText={setFullName}
        />

        {/* ADDRESS */}
        <Text style={styles.label}>Address*</Text>
        <TextInput
          style={styles.input}
          placeholder="Your complete address"
          value={address}
          onChangeText={setAddress}
        />

        {/* DATE PICKER FOR BIRTHDATE */}
        <Text style={styles.label}>Birthdate</Text>

        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={birthdate}
          onPressIn={() => setShowDatePicker(true)}
        />

        {showDatePicker && (
          <DateTimePicker
            value={birthdate ? new Date(birthdate) : new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
          />
        )}

        {/* CONTACT */}
        <Text style={styles.label}>Contact Number</Text>
        <TextInput
          style={styles.input}
          placeholder="09xxxxxxxxx"
          keyboardType="numeric"
          value={contactNum}
          onChangeText={setContactNum}
        />

        {/* EMAIL */}
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="example@email.com"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.submitButton}>
        <Button title="Submit Request" color="#0a7d38" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#e9f5ee",
    flexGrow: 1,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0a7d38",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 14,
    borderLeftWidth: 6,
    borderLeftColor: "#e6b800",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    color: "#0a7d38",
  },

  input: {
    backgroundColor: "#f4f4f4",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    fontSize: 14,
  },

  submitButton: {
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
  },

  /** ADD PICKER STYLES HERE */
  pickerWrapper: {
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    marginTop: 5,
  },

  picker: {
    height: 50,
  },
});


