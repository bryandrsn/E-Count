import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export default function RemoveItem() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    const [itemId, setItemId] = useState("");
    const [itemName, setItemName] = useState("");
    const [itemStock, setItemStock] = useState("");

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

    const resetState = () => {
        setItemId("");
        setItemName("");
        setItemStock("");
    };

    const handleBarcodeScanned = async ({ type, data }) => {
        if (scanned) return;
        setScanned(true);

        const docRef = doc(db, "items", data);
        const docSnapshot = await getDoc(docRef);
        if (!docSnapshot.exists()) {
            Alert.alert(
                "Gagal Menghapus!",
                `Barang bernama ${docSnapshot.data().name} dengan ID ${docSnapshot.id} tidak ada di database.`,
                [
                    {
                        text: "Rescan",
                        onPress: () => setScanned(false),
                    },
                ]
            );
            return;
        };
        setItemId(docSnapshot.id);
        setItemName(docSnapshot.data().name);
        setItemStock(docSnapshot.data().stock);
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
            const docRef = doc(db, "items", itemId);
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
            <>
                <CameraView
                    onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr", "ean13", "upc_a", "upc_e"],
                    }}
                    style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.scanBox} />
            </>
            )}
            {scanned && (
                <>
                    <Text style={styles.textTitle}>Nama Barang</Text>
                    <TextInput
                        style={styles.textBox}
                        value={itemName}
                        editable={false}
                    />
                    <Text style={styles.textTitle}>Stock Barang</Text>
                    <TextInput
                        style={styles.textBox}
                        value={itemStock.toString()}
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
                </>
            )}
            <StatusBar style="light" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#428bca",
        padding: 30,
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
    scanBox: {
        width: 250,
        height: 250,
        borderWidth: 8,
        borderRadius: 25,
        borderColor: '#ffffff',
        position: 'absolute',
        top: '25%',
        left: '25%',
    },
    buttonRemove: {
        backgroundColor: "#DD1010",
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