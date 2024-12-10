import React, { useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { Text, FlatList, View, StyleSheet, Button, RefreshControl, Alert, TouchableOpacity } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { MaterialCommunityIcons, Feather }from '@expo/vector-icons';

export default function ListStock() {
    const [items, setItems] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const stockThreshold = 10;

    const fetchItems = async () => {
        try {
            const docRef = collection(db, "items");
            const fetchItems = await getDocs(docRef);
            const itemsData = fetchItems.docs.map(item => ({
                id: item.id,
                ...item.data()
            }));
            setItems(itemsData);
        }
        catch (error) {
            console.error('Fetch Items Error:', error);
            Alert.alert('Terjadi Kesalahan!', 'Tidak dapat terhubung ke server. Silakan coba lagi.');
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const refreshList = async () => {
        setRefresh(true);
        await fetchItems();
        setRefresh(false);
    };

    const reportLowStock = async (item) => {
        try {
            const docRef = doc(db, "items", item.id);
            await updateDoc(docRef, { isLow: true });
            Alert.alert(
                "Melaporkan Stok Rendah",
                `Stok barang "${item.name}" rendah (tersisa ${item.stock} unit). Notifikasi telah dikirim ke admin.`
            );
        }
        catch {
            console.error("Update Report Error:", error);
            Alert.alert("Terjadi Kesalahan!", "Tidak dapat terhubung ke server. Silakan coba lagi.");
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <View style={styles.dataBox}>
                            <View style={styles.icon}>
                                <Feather name="package" size={40} color="#428bca" />
                            </View>
                            <View style={styles.dataContainer}>
                                <Text style={styles.itemText}>{item.name}</Text>
                            </View>
                        </View>
                        <View style={styles.dataBox}>
                            <View style={styles.icon}>
                                <MaterialCommunityIcons name="counter" size={40} color="#428bca" />
                            </View>
                            <View style={styles.dataContainer}>
                                <Text style={styles.itemText}>{item.stock}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                item.stock < stockThreshold ? styles.buttonActive : styles.buttonDisabled
                            ]}
                            onPress={() => item.stock < stockThreshold && reportLowStock(item)}
                            disabled={item.stock >= stockThreshold}
                        >
                            <Text style={styles.buttonText}>Laporkan Stok Rendah</Text>
                        </TouchableOpacity>
                    </View>
                )}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={refreshList} />
                }
                ListEmptyComponent={
                    <View style={styles.buttonContainer}>
                        <Button title="Reload" onPress={() => fetchItems()} color="#d9534f" />
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
        fontSize: 18,
        color: '#f9f9f9'
    },
    button: {
        marginTop: 15,
        padding: 10,
        borderRadius: 20,
        alignItems: "center",
    },
    buttonActive: {
        backgroundColor: "#d9534f",
    },
    buttonDisabled: {
        backgroundColor: "#ccc",
    },
    buttonText: {
        color: "#f9f9f9",
        fontWeight: "bold",
    },
});
