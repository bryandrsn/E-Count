import React, { useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { Text, FlatList, View, StyleSheet, Button, RefreshControl, Alert } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export default function ListItem(){
    const [items, setItems] = useState([]);
    const [refresh, setRefresh] = useState(false)
    
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
    }

    useEffect(() => {
        fetchItems();
    }, []);

    const refreshList = async () => {
        setRefresh(true)
        await fetchItems();
        setRefresh(false)
    }

    return(
        <View style={styles.container}>
            <FlatList
                data = {items}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>ID: {item.id}</Text>
                        <Text style={styles.itemText}>Nama: {item.name}</Text>
                        <Text style={styles.itemText}>Stock: {item.stock}</Text>
                    </View>
                )}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={refreshList} />
                }
                ListEmptyComponent={<View style={styles.buttonContainer} ><Button title="Reload" onPress={fetchItems} /></View>}
            />
            
            <StatusBar style="light" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    itemContainer: {
        padding: 20,
        backgroundColor: "#cecece",
        marginBottom: 20,
    },
    textBox: {
        
    },
    itemText: {

    },
})