import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { CameraView, Camera } from "expo-camera";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export default function AddStock() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    const [itemsData, setItemsData] = useState({
        id: "",
        name: "",
        price: 0,
        stock: 0,
    });

    const [itemStock, setItemStock] = useState(0)

    const resetState = () => {
        setItemsData({
            id: "",
            name: "",
            price: 0,
            stock: 0,
        });
        setItemStock(0);
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
        if (!docSnapshot.exists()) {
            Alert.alert(
                "Barang Tidak Ditemukan!",
                `Barang dengan ID ${data} tidak ditemukan di database.`,
                [
                    {
                        text: "Rescan",
                        onPress: () => setScanned(false),
                    },
                ]
            );
            return;
        }
        setItemsData({
            id: docSnapshot.id,
            ...docSnapshot.data(),
        });
    };

    const handleAddStock = async () => {
        if (itemStock !== 0) {
            try {
                const currentStock = itemsData.stock;
                const stock = itemStock;
                const docRef = doc(db, "items", itemsData.id);
                await updateDoc(docRef, { stock: currentStock + stock })
                Alert.alert("Tambah Stok Berhasil!", "Stok berhasil ditambah.");
                resetState();
                setScanned(false);
            }
            catch (error) {
                console.error("Add Stock Error:", error);
                Alert.alert("Terjadi Kesalahan!", "Tidak dapat terhubung ke server. Silakan coba lagi.");
            }
        }
        else {
            Alert.alert("Tidak boleh nol!", "Silakan masukkan jumlah stok yang ingin ditambah.");
        }
    };

    return (
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
                <View style={styles.container}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.boxTitle}>Nama Barang</Text>
                        <TextInput
                            style={styles.textBox}
                            value={itemsData.name}
                            editable={false}
                        />
                        <Text style={styles.boxTitle}>Harga Barang</Text>
                        <TextInput
                            style={styles.textBox}
                            value={itemsData.price.toString()}
                            editable={false}
                        />
                        <Text style={styles.boxTitle}>Stock Barang</Text>
                        <TextInput
                            style={styles.textBox}
                            value={itemsData.stock.toString()}
                            editable={false}
                        />
                    </View>

                    <Text style={styles.textTitle}>Jumlah stok yang ingin ditambah:</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={itemStock.toString()}
                            onChangeText={(value) => {
                                const newValue = value === "" ? 0 : parseInt(value);
                                setItemStock(newValue);
                            }}
                        />
                        <View style={styles.buttonInputContainer}>
                            <TouchableOpacity style={styles.buttonInput}
                                onPress={() => {
                                    const incrementStock = itemStock + 1;
                                    setItemStock(incrementStock);
                                }}
                            >
                                <FontAwesome name="plus-square-o" size={50} color="#f9f9f9" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonInput}
                                onPress={() => {
                                    const DecrementStock = itemStock <= 0 ? 0 : itemStock - 1;
                                    setItemStock(DecrementStock);
                                }}
                            >
                                <FontAwesome name="minus-square-o" size={50} color="#f9f9f9" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonAdd} onPress={() => handleAddStock()}>
                            <Text style={styles.buttonText}>Tambah Stok</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonRescan}
                            onPress={() => {
                                resetState();
                                setScanned(false);
                            }}
                        >
                            <Text style={styles.buttonText}>Rescan</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            <StatusBar style="light" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
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
    infoContainer : {
        paddingHorizontal: 30,
        marginBottom: 30,
    },
    boxTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    textBox: {
        width: '100%',
		height: 45,
		borderRadius: 5,
		marginBottom: 10,
		paddingLeft: 15,
		fontSize: 16,
		backgroundColor: '#f9f9f9',
		shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    textTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#f9f9f9',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row', 
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
    },
    input: {
		width: 175,
		height: 100,
		borderRadius: 10,
		paddingHorizontal: 15,
		fontSize: 60,
        textAlign: 'right',
		backgroundColor: '#f9f9f9',
		shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
	},
    buttonInputContainer: {
        height: 100,
        marginLeft: 15,
        justifyContent: 'center',
    },
    buttonInput: {
        height: 45,
        margin: 3,
    },
    buttonContainer: {
        flex: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonAdd: {
        backgroundColor: "#5cb85c",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginBottom: 5,
    },
    buttonRescan: {
        backgroundColor: "#1E90FF",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: 'center',
    },
});
