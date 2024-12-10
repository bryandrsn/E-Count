import React, { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export default function AddItem() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    
    const [itemsData, setItemsData] = useState({
        id: "",
        name: "",
        price: 0,
        stock: 0,
    });

    const updateItemsData = (key, value) => {
        setItemsData((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const resetState = () => {
        setItemsData({ id: "", name: "", price: 0, stock: 0});
    };

    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        };

        getCameraPermissions();
    }, []);

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const handleBarcodeScanned = async ({ type, data }) => {
        if (scanned) return;
        setScanned(true);

        const docRef = doc(db, "items", data);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
            Alert.alert(
                "Gagal Menambahkan!",
                `Barang bernama ${docSnapshot.data().name} dengan ID ${docSnapshot.id} sudah terdaftar di database.`,
                [
                    {
                        text: "Rescan",
                        onPress: () => setScanned(false),
                    },
                ]
            );
            return;
        };
        updateItemsData("id", data);
    };

    const handleAddItem = async () => {
        const {id, name, price, stock} = itemsData
        if (id && name && price && stock) {
            try {
                const docRef = doc(db, "items", id);
                await setDoc(docRef, {
                    name: name,
                    price: price,
                    stock: stock,
                });
                Alert.alert("Tambah Barang Berhasil!", "Barang berhasil ditambahkan.");
                resetState();
                setScanned(false);
            }
            catch (error) {
                console.error('Add Item Error:', error);
                Alert.alert('Terjadi Kesalahan!', 'Tidak dapat terhubung ke server. Silakan coba lagi.');
            }
        }
        else {
            Alert.alert("Tidak boleh kosong!", "Silakan lengkapi data yang kosong.");
        }
    };

    return(
        <View style={styles.container}>
            {!scanned && (
                <View style={styles.cameraContainer} >
                    <Text style={styles.textCamera}>SCAN BARCODE</Text>
                    <CameraView
                        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                        barcodeScannerSettings={{
                            barcodeTypes: ["qr", "ean13", "upc_a", "upc_e"],
                        }}
                        style={styles.camera}
                    >
                        <View style={styles.scanBox} />
                    </CameraView>
                </View>
            )}
            {scanned && (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nama Barang"
                        placeholderTextColor="#777"
                        value={itemsData.name}
                        onChangeText={(value) => updateItemsData("name", value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Harga Barang"
                        placeholderTextColor="#777"
                        value={itemsData.price}
                        onChangeText={(value) => updateItemsData("price", parseInt(value))}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Jumlah Stock"
                        placeholderTextColor="#777"
                        value={itemsData.stock}
                        onChangeText={(value) => updateItemsData("stock", parseInt(value))}
                    />
                    <TouchableOpacity
                        style={styles.buttonAdd}
                        onPress={() => handleAddItem()}
                    >
                        <Text style={styles.buttonText}>Add Item</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonRescan}
                        onPress={() => {
                            resetState();
                            setScanned(false);
                        }}
                    >
                        <Text style={styles.buttonText}>Tap to Rescan</Text>
                    </TouchableOpacity>
                </View>
            )}
            <StatusBar style="light" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#428bca",
    },
    textCamera: {
        color: "#fff",
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 25,
    },
    cameraContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanBox: {
        width: 300,
        height: 300,
        borderWidth: 7,
        borderRadius: 30,
        borderColor: '#ffffff',
        justifyContent: 'center',
    },
    camera: {
        width: 300,
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
    },
    inputContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    input: {
		width: '100%',
		height: 45,
		borderColor: '#fff',
		borderRadius: 5,
		marginBottom: 15,
		paddingLeft: 15,
		fontSize: 16,
		backgroundColor: '#f9f9f9',
		shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
	},
    buttonAdd: {
        backgroundColor: "#5cb85c",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignSelf: "center",
        position: "absolute",
        bottom: 100,
    },
    buttonRescan: {
        backgroundColor: "#1E90FF",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignSelf: "center",
        position: "absolute",
        bottom: 25,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    }
});