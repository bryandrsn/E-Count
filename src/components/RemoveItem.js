import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export default function RemoveItem() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    const [itemsData, setItemsData] = useState({
        id: "",
        name: "",
        price: 0,
        stock: 0,
    });

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
        const fetchData = await getDoc(docRef);
        if (!fetchData.exists()) {
            Alert.alert(
                "Gagal Menghapus!",
                `Barang dengan ID ${data} tidak ditemukan di database.`,
                [
                    {
                        text: "Rescan",
                        onPress: () => setScanned(false),
                    },
                ]
            );
            return;
        };
        setItemsData({
            id: fetchData.id,
            ...fetchData.data(),
        });
    };

    const confirmRemove = () => {
        Alert.alert(
            "Konfirmasi", "Apakah anda yakin ingin menghapus barang ini?",
            [
                { text: "Batal", style: "cancel"},
                { text: "Ya", onPress: () => handleRemoveItem()}
            ]
        );
    };

    const handleRemoveItem = async () => {
        try {
            const docRef = doc(db, "items", itemsData.id);
            await deleteDoc(docRef)
            Alert.alert("Hapus Barang Berhasil!", "Barang berhasil dihapus.");
            resetState();
            setScanned(false);
        }
        catch (error) {
            console.error('Remove Item Error:', error);
            Alert.alert('Terjadi Kesalahan!', 'Tidak dapat terhubung ke server. Silakan coba lagi.');
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
                <View style={styles.infoContainer}>
                    <Text style={styles.textTitle}>Nama Barang</Text>
                    <TextInput
                        style={styles.textBox}
                        value={itemsData.name}
                        editable={false}
                    />
                    <Text style={styles.textTitle}>Harga Barang</Text>
                    <TextInput
                        style={styles.textBox}
                        value={itemsData.price.toString()}
                        editable={false}
                    />
                    <Text style={styles.textTitle}>Stock Barang</Text>
                    <TextInput
                        style={styles.textBox}
                        value={itemsData.stock.toString()}
                        editable={false}
                    />
                    <TouchableOpacity
                        style={styles.buttonRemove}
                        onPress={() => confirmRemove()}
                    >
                        <Text style={styles.buttonText}>Remove Item</Text>
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
};

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
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    textTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    textBox: {
		width: '100%',
		height: 45,
		borderRadius: 5,
		marginBottom: 30,
		paddingLeft: 15,
		fontSize: 16,
		backgroundColor: '#f9f9f9',
		shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
	},
    buttonRemove: {
        backgroundColor: "#d9534f",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignSelf: "center",
        position: "absolute",
        bottom: 100,
    },
    buttonRescan: {
        backgroundColor: "#5cb85c",
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