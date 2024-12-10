import React, { useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { Text, FlatList, View, StyleSheet, Button, RefreshControl, Alert, TouchableOpacity } from "react-native";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { MaterialCommunityIcons }from '@expo/vector-icons';

export default function VerifyAcc(){
    const [accounts, setAccounts] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const fetchAccounts = async () => {
        try {
            const docRef = collection(db, "accounts");
            const fetchAccs = await getDocs(docRef);
            const accountData = fetchAccs.docs.filter(acc => acc.data().verified === false)
            .map(acc => ({
                id: acc.id,
                ...acc.data()
            }));
            setAccounts(accountData);
        }
        catch (error) {
            console.error('Fetch Accounts Error:', error);
            Alert.alert('Terjadi Kesalahan!', 'Tidak dapat terhubung ke server. Silakan coba lagi.');
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const refreshList = async () => {
        setRefresh(true);
        await fetchAccounts();
        setRefresh(false);
    };

    const handleVerify = async (acc) => {
        try {
            const docRef = doc(db, "accounts", acc.id);
            await updateDoc(docRef, { verified: true });
            Alert.alert("Akun telah diverifikasi!", "Sekarang akun dapat digunakan oleh pekerja.");
            await refreshList();
        }
        catch {
            console.error("Update Verify Error:", error);
            Alert.alert("Terjadi Kesalahan!", "Tidak dapat terhubung ke server. Silakan coba lagi.");
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={accounts}
                keyExtractor={(acc) => acc.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <View style={styles.dataBox}>
                            <View style={styles.icon}>
                                <MaterialCommunityIcons name="identifier" size={40} color="#428bca" />
                            </View>
                            <View style={styles.dataContainer}>
                                <Text style={styles.itemText}>{item.id}</Text>
                            </View>
                        </View>
                        <View style={styles.dataBox}>
                            <View style={styles.icon}>
                                <MaterialCommunityIcons name="email-outline" size={40} color="#428bca" />
                            </View>
                            <View style={styles.dataContainer}>
                                <Text style={styles.itemText}>{item.email}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                !item.verified ? styles.buttonActive : styles.buttonDisabled
                            ]}
                            onPress={() => handleVerify(item)}
                            disabled={item.verified}
                        >
                            <Text style={styles.buttonText}>Verifikasi</Text>
                        </TouchableOpacity>
                    </View>
                )}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={refreshList} />
                }
                ListEmptyComponent={
                    <View style={styles.buttonContainer}>
                        <Button title="Reload" onPress={() => fetchAccounts()} color="#d9534f" />
                    </View>
                }
            />

            <StatusBar style="light" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: "#eeeeee",
    },
    itemContainer: {
        padding: 20,
        backgroundColor: "#f9f9f9",
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    dataBox : {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#428bca",
        marginVertical: 5,
    },
    icon: {
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
        backgroundColor: 'white',
    },
    dataContainer: {
        flex: 1,
        height: 45,
        justifyContent: 'center',
        paddingLeft: 15,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: "#428bca"
    },
    itemText: {
        fontSize: 14,
        color: '#f9f9f9'
    },
    button: {
        marginTop: 15,
        padding: 10,
        borderRadius: 20,
        alignItems: "center",
    },
    buttonActive: {
        backgroundColor: "#5cb85c",
    },
    buttonDisabled: {
        backgroundColor: "#ccc",
    },
    buttonText: {
        color: "#f9f9f9",
        fontWeight: "bold",
    },
});