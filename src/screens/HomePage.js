import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { logout } from '../../firebaseAuth';

export default function HomePage() {
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
                { text: "Batal", style: "cancel", onPress: () => {return}},
                { text: "Ya", onPress: () => logout() && navigation.navigate("Login")}
            ]
        );
        // navigation.navigate('Login')
    };

    const HomeScreen = () => (
        <View>
            <View style={styles.headerHome}>
                <Text style={styles.headerText}>Selamat Datang, Admin Gudang</Text>
            </View>

            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Tambah Barang')}>
                    <Ionicons name="add-circle-outline" size={60} />
                    <Text style={styles.menuText}>Add</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Hapus Barang')}>
                    <Ionicons name="remove-circle-outline" size={60} />
                    <Text style={styles.menuText}>Subtract</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Daftar Barang')}>
                    <Ionicons name="list-circle-outline" size={60} />
                    <Text style={styles.menuText}>View List</Text>
                </TouchableOpacity>
            </View>

            <StatusBar style="light" />
        </View>
    );

    const AccountScreen = () => (
        <View>
            <View style={styles.headerAccount}>
                <View style={styles.circleBackground} />
                <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout} >
                    <Ionicons name="exit-outline" size={35} color="#f9f9f9" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Informasi Akun</Text>
                <Ionicons name="person" size={100} color="#cccccc" style={styles.profilePicture} />
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={20} color="#6C63FF" />
                    <TextInput
                        style={styles.infoText}
                        placeholder="Anna Avetisyan"
                        placeholderTextColor="#555"
                    />
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={20} color="#6C63FF" />
                    <TextInput
                        style={styles.infoText}
                        placeholder="Birthday"
                        placeholderTextColor="#555"
                    />
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={20} color="#6C63FF" />
                    <TextInput
                        style={styles.infoText}
                        placeholder="818 123 4567"
                        placeholderTextColor="#555"
                    />
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="logo-instagram" size={20} color="#6C63FF" />
                    <TextInput
                        style={styles.infoText}
                        placeholder="Instagram account"
                        placeholderTextColor="#555"
                    />
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={20} color="#6C63FF" />
                    <TextInput
                        style={styles.infoText}
                        placeholder="info@aplusdesign.co"
                        placeholderTextColor="#555"
                    />
                </View>
            </View>


        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.content}>{renderScreen()}</View>
            
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === "Home" && styles.activeTab]}
                    onPress={() => setActiveTab("Home")}>
                    <Ionicons name="home-outline" size={30} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === "Account" && styles.activeTab]}
                    onPress={() => setActiveTab("Account")}>
                    <Ionicons name="person-outline" size={30} />
                </TouchableOpacity>
            </View>
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
    },
    headerHome: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    headerAccount: {
        alignItems: 'center',
        marginTop: 25,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#f9f9f9',
        marginBottom: 30,
    },
    menuContainer: {
        flex: 1,
        flexDirection: 'row', 
        alignItems: 'center',
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
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        padding: 30,
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
        backgroundColor: "cccccc",
    },
    tabButton: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 15,
    },
    activeTab: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: '#f9f9f9',
    },
});
