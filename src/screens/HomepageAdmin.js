import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { logout } from '../../firebaseAuth';

export default function HomepageAdmin() {
    const navigation = useNavigation();

    const [activeTab, setActiveTab] = useState("Home");

    const renderScreen = () => {
        if (activeTab === "Home") {
            return <HomeScreen />;
        } else if (activeTab === "Dashboard") {
            return <DashboardScreen />;
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

    const HomeScreen = () => (
        <View style={styles.content}>
            <View style={styles.headerHome}>
                <Text style={styles.headerText}>Selamat Datang, Admin Gudang</Text>
            </View>

            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Tambah Barang')}>
                    <Ionicons name="add-circle-outline" size={60} color="#5cb85c" />
                    <Text style={styles.menuText}>Add</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Hapus Barang')}>
                    <Ionicons name="remove-circle-outline" size={60} color="#d9534f" />
                    <Text style={styles.menuText}>Remove</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Daftar Barang')}>
                    <Ionicons name="list-circle-outline" size={60} />
                    <Text style={styles.menuText}>View List</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const DashboardScreen = () => (
        <View style={styles.content} >
            <View style={styles.headerDashboard} >
                <Text style={styles.headerText}>Dashboard Admin</Text>
            </View>
            <View style={styles.toolContainer}>
                <TouchableOpacity style={styles.toolButton} onPress={() => navigation.navigate('Verifikasi Akun')}>
                    <MaterialCommunityIcons name="account-check-outline" size={60} color="black" />
                    <Text style={styles.toolText}>Verify Accounts</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.toolButton} onPress={() => navigation.navigate('Stok Rendah')}>
                    <MaterialIcons name="running-with-errors" size={60} color="black" />
                    <Text style={styles.toolText}>Low on Stock</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.buttonLogout} onPress={() => handleLogout()} >
                <Ionicons name="exit-outline" size={24} color="#f9f9f9" />
                <Text style={styles.buttonLogoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );

    const TabBar = ({ activeTab, setActiveTab }) => {
        return (
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === "Home" && styles.activeTab]}
                    onPress={() => setActiveTab("Home")}>
                    <MaterialIcons name="home" size={30} color="black" />
                    <Text style={styles.tabText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === "Dashboard" && styles.activeTab]}
                    onPress={() => setActiveTab("Dashboard")}>
                    <MaterialIcons name="admin-panel-settings" size={30} color="black" />
                    <Text style={styles.tabText}>Dashboard</Text>
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
    headerDashboard: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 75,
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#f9f9f9',
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
    toolContainer: {
        flex: 0,
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 50,
    },
    toolButton: {
        width: '100%',
        paddingVertical: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginVertical: 10,
    },
    toolText: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
    },
    buttonLogout: {
        width: '85%',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 50,
        backgroundColor: '#d9534f',
        marginBottom: 10,
    },
    buttonLogoutText: {
        fontSize: 12,
        color: '#f9f9f9',
        fontWeight: '400',
        textAlign: 'center'
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
