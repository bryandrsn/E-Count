import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { logout } from '../../firebaseAuth';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export default function HomepageWorker() {
    const navigation = useNavigation();

    const [activeTab, setActiveTab] = useState("Home");

    const renderScreen = () => {
        if (activeTab === "Home") {
            return <HomeScreen />;
        } else if (activeTab === "Account") {
            return <AccountScreen />;
        }
        return null;
    };

    const handleLogout = () => {
        Alert.alert(
            "Konfirmasi", "Apakah anda yakin ingin logout?",
            [
                { text: "Batal", style: "cancel"},
                { text: "Ya", onPress: () => logout() && navigation.navigate("Login")}
            ]
        );
    };

    const [workerData, setWorkerData] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
    });

    const fetchWorkerData = async () => {
        try {
            const auth = getAuth();
            const workerId = auth.currentUser.uid;

            const docRef = doc(db, "accounts", workerId);
            const docSnapshot = await getDoc(docRef);
            const workerData = docSnapshot.data();
            setWorkerData({
                name: workerData.name,
                address: workerData.address,
                phone: workerData.phone,
                email: workerData.email,
            })
        }
        catch {
            console.error("Error fetching worker data:", error);
            Alert.alert("Error", "Gagal mengambil data pekerja.");
        }
    };

    useEffect(() => {
        fetchWorkerData();
    }, []);

    const HomeScreen = () => (
        <View style={styles.content}>
            <View style={styles.headerHome}>
                <Text style={styles.headerText}>Selamat Datang, Pekerja Gudang</Text>
            </View>

            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Tambah Stok')}>
                    <Ionicons name="add-circle-outline" size={60} color="#5cb85c" />
                    <Text style={styles.menuText}>Add</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Kurangi Stok')}>
                    <Ionicons name="remove-circle-outline" size={60} color="#d9534f" />
                    <Text style={styles.menuText}>Subtract</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Lihat Stok')}>
                    <Ionicons name="list-circle-outline" size={60} />
                    <Text style={styles.menuText}>View List</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const AccountScreen = () => (
        <View style={styles.content} >
            <View style={styles.headerAccount}>
                <TouchableOpacity style={styles.buttonLogout} onPress={() => handleLogout()} >
                    <Ionicons name="exit-outline" size={35} color="#f9f9f9" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Informasi Akun</Text>
                <Ionicons name="person" size={100} color="#cccccc" style={styles.profilePicture} />
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={20} color="#428bca" />
                    <TextInput
                        style={styles.infoText}
                        value={workerData.name}
                        editable={false}
                    />
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={20} color="#428bca" />
                    <TextInput
                        style={styles.infoText}
                        value={workerData.address}
                        editable={false}
                    />
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={20} color="#428bca" />
                    <TextInput
                        style={styles.infoText}
                        value={workerData.phone}
                        editable={false}
                    />
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={20} color="#428bca" />
                    <TextInput
                        style={styles.infoText}
                        value={workerData.email}
                        editable={false}
                    />
                </View>
            </View>
        </View>
    );

    const TabBar = ({ activeTab, setActiveTab }) => {
        return (
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === "Home" && styles.activeTab]}
                    onPress={() => setActiveTab("Home")}>
                    <Ionicons name="home-outline" size={30} />
                    <Text style={styles.tabText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === "Account" && styles.activeTab]}
                    onPress={() => setActiveTab("Account")}>
                    <Ionicons name="person-outline" size={30} />
                    <Text style={styles.tabText}>Profile</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {renderScreen()}
            
            <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
            <StatusBar style="light" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#428bca',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerHome: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 60,
    },
    headerAccount: {
        alignItems: 'center',
        marginTop: 30,
        height: '45%',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#f9f9f9',
        marginBottom: 30,
    },
    menuContainer: {
        flexDirection: 'row', 
        justifyContent: 'center',
        width: '100%',
    },
    menuButton: {
        width: 100,
        height: 100,
        backgroundColor: '#f9f9f9',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    menuText: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
    },
    profilePicture: {
        borderRadius: 120,
        padding: 15,
        backgroundColor: '#f9f9f9',
    },
    infoContainer: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 30,
    },
    infoRow: {
        flexDirection: 'row',
        width: '100%',
		height: 45,
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        marginBottom: 15,
        borderRadius: 5,
        paddingLeft: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    infoText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
        color: '#555',
    },
    buttonLogout: {
        width: 45,
        height: 45,
        marginLeft: '85%',
        padding: 5,
    },

    tabBar: {
        flexDirection: "row",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: "#dedede",
    },
    tabButton: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 10,
    },
    activeTab: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: '#f9f9f9',
    },
    tabText: {
        fontSize: 12,
        color: '#000',
        fontWeight: '400',
    },
});
