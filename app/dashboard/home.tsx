import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

type CertificateRequest = {
  id: string;
  certType: string;
  fullName: string;
  address: string;
  birthdate: string;
  contactNum: string;
  email: string;
  status: string;
  submittedAt: string;
  submittedBy: string;
};

export default function HomeTab() {
  const [requests, setRequests] = useState<CertificateRequest[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const loadRequests = async () => {
    try {
      const adminValue = await AsyncStorage.getItem("isAdmin");
      setIsAdmin(adminValue === "true");

      const saved = await AsyncStorage.getItem("requests");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRequests(parsed);
        }
      }
    } catch {
      Alert.alert("Error", "Failed to load requests.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [])
  );

  const handleRefresh = () => {
    loadRequests();
    Alert.alert("Refreshed", "Data has been updated.");
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const updated = requests.map((r) =>
        r.id === id ? { ...r, status } : r
      );
      setRequests(updated);
      await AsyncStorage.setItem("requests", JSON.stringify(updated));
    } catch {
      Alert.alert("Error", "Failed to update request.");
    }
  };

  const handleRemove = async (id: string) => {
    try {
      const filtered = requests.filter((r) => r.id !== id);
      setRequests(filtered);
      await AsyncStorage.setItem("requests", JSON.stringify(filtered));
    } catch {
      Alert.alert("Error", "Failed to remove request.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Certificate Requests</Text>

      {/* --------------------------- */}
      {/* TOP BUTTONS (ADDED BACK)    */}
      {/* --------------------------- */}
      <View style={styles.topButtons}>
        {!isAdmin && (
          <Button
            mode="contained"
            onPress={() => router.push("/request")}
            style={styles.btnRequest}
          >
            Request Certificate
          </Button>
        )}

        <Button
          mode="contained"
          onPress={handleRefresh}
          style={styles.btnRefresh}
        >
          Refresh
        </Button>
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No certificate requests yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.certType}>{item.certType}</Text>
            <Text style={styles.label}>
              Name: <Text style={styles.value}>{item.fullName}</Text>
            </Text>

            {isAdmin && (
              <>
                <Text style={styles.label}>Address: <Text style={styles.value}>{item.address}</Text></Text>
                <Text style={styles.label}>Birthdate: <Text style={styles.value}>{item.birthdate}</Text></Text>
                <Text style={styles.label}>Contact: <Text style={styles.value}>{item.contactNum}</Text></Text>
                <Text style={styles.label}>Email: <Text style={styles.value}>{item.email}</Text></Text>
                <Text style={styles.label}>Submitted By: <Text style={styles.value}>{item.submittedBy}</Text></Text>
              </>
            )}

            <Text
              style={[
                styles.status,
                item.status === "Pending" && styles.statusPending,
                item.status === "Ready to Receive" && styles.statusReady,
                item.status === "Done" && styles.statusDone,
              ]}
            >
              Status: {item.status}
            </Text>

            <Text style={styles.date}>Submitted: {formatDate(item.submittedAt)}</Text>

            {isAdmin && (
              <View style={styles.adminButtons}>
                <Button
                  mode="contained"
                  onPress={() => handleUpdateStatus(item.id, "Ready to Receive")}
                  style={styles.btnReady}
                >
                  Ready
                </Button>

                <Button
                  mode="contained"
                  onPress={() => handleUpdateStatus(item.id, "Done")}
                  style={styles.btnDone}
                >
                  Done
                </Button>

                <Button
                  mode="contained"
                  onPress={() => handleRemove(item.id)}
                  style={styles.btnRemove}
                >
                  Remove
                </Button>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef5ea",
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
    color: "#1B5E20",
  },

  /* NEW BUTTON STYLES */
  topButtons: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 10,
  },
  btnRequest: {
    flex: 1,
    backgroundColor: "#2E7D32",
  },
  btnRefresh: {
    flex: 1,
    backgroundColor: "#558B2F",
  },

  empty: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#777",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#2E7D32",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    elevation: 3,
  },
  certType: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },
  value: {
    fontWeight: "400",
    color: "#000",
  },
  status: {
    marginTop: 10,
    padding: 6,
    borderRadius: 5,
    fontWeight: "700",
    textAlign: "center",
    color: "#fff",
  },
  statusPending: { backgroundColor: "#F9A825" },
  statusReady: { backgroundColor: "#388E3C" },
  statusDone: { backgroundColor: "#1565C0" },

  date: {
    marginTop: 6,
    fontSize: 12,
    color: "#555",
    textAlign: "right",
  },
  adminButtons: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "space-between",
  },
  btnReady: { backgroundColor: "#4CAF50" },
  btnDone: { backgroundColor: "#1565C0" },
  btnRemove: { backgroundColor: "#C62828" },
});
