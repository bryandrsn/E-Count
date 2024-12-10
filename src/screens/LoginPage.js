import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { login }from '../../firebaseAuth';

export default function LoginPage() {
	const navigation = useNavigation();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async () => {
		let emailBersih = email.trim();
		if ( emailBersih === '' || password === '' ) {
			Alert.alert('Login Gagal!', 'Email dan password tidak boleh kosong.');
			return;
		};
	
		setIsLoading(true);
		try {
			const loginKey = await login(email, password);
			setIsLoading(false);

			if (loginKey.isLoggedIn && loginKey.verified) {
				loginKey.role === "admin" ? navigation.navigate('Homepage Admin') : navigation.navigate('Homepage Worker')
			}
			else {
				if (!loginKey.isLoggedIn) {
					Alert.alert('Login Gagal!', 'Email atau password salah. Silakan coba lagi.');
				}
				else if (!loginKey.verified) {
					Alert.alert('Akun anda belum terverifikasi!', 'Silahkan hubungi Admin untuk verifikasi akun.');
				}
			}
		}
		catch (error) {
			console.error('Login Error:', error);
			setIsLoading(false)
			Alert.alert('Terjadi Kesalahan!', 'Tidak dapat terhubung ke server. Silakan coba lagi.');
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>LOGIN</Text>

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

			{isLoading ? (<ActivityIndicator style={{marginTop: 30}} size={50} color='#f9f9f9'/>) :
			(
			<>
				<TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
					<Text style={styles.buttonText}>Login</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.buttonRegister} onPress={() => navigation.navigate('Register')}>
					<Text style={styles.buttonText}>Register</Text>
				</TouchableOpacity>
			</>
			)}
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
		marginBottom: 75,
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
	buttonLogin: {
		width: '100%',
		paddingVertical: 12,
		backgroundColor: '#5cb85c',
		borderRadius: 5,
		marginTop: 25,
		marginBottom: 5,
		alignItems: 'center',
		shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
	},
	buttonRegister: {
		width: '100%',
		paddingVertical: 12,
		backgroundColor: '#d9534f',
		borderRadius: 5,
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
});
