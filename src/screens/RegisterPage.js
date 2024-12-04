import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { register } from '../../firebaseAuth';

export default function RegisterPage() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cekPassword, setCekPassword] = useState('');

    const handleRegister = async () => {
        let emailBersih = email.trim();
        if ( emailBersih === '' || password === '' ) {
			Alert.alert('Login Gagal!', 'Email dan password tidak boleh kosong.');
			return;
		};

        if (cekPassword === password) { 
            try {
                const isRegister = await register(emailBersih, password)
                if (isRegister === true) {
                    Alert.alert("Register Sukses!", "Akun anda berhasil diregister, silakan login dengan akun anda.");
                    navigation.navigate("Login")
                };
            }
            catch {
                console.error('Register Error:', error);
			    Alert.alert('Terjadi Kesalahan!', 'Tidak dapat terhubung ke server. Silakan coba lagi nanti.');
            }
        }
        else
        {
            Alert.alert("Konfirmasi password anda salah!", "Silahkan ulangi kembali!")
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>REGISTER</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#777"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#777"
                value={password}
                onChangeText={setPassword}
                //secureTextEntry={true}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#777"
                value={cekPassword}
                onChangeText={setCekPassword}
                //secureTextEntry={true}
            />

            <TouchableOpacity style={styles.buttonRegister} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#428bca',
        padding: 30,
    },
    header: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#f9f9f9',
        marginBottom: 50,
    },
    input: {
        width: '100%',
        height: 45,
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
    buttonRegister: {
        width: '100%',
        paddingVertical: 15,
        backgroundColor: '#d9534f',
        borderRadius: 5,
        marginTop: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    buttonText: {
        color: '#f9f9f9',
        fontSize: 18,
        fontWeight: 'bold',
    },
    pickerBorder: {
        width: '100%',
        height: 60,
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    picker: {
        height: '100%',
        width: '100%',
    }
});