import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginPage from './src/screens/LoginPage';
import RegisterPage from './src/screens/RegisterPage';
import HomepageWorker from './src/screens/HomepageWorker';
import HomepageAdmin from './src/screens/HomepageAdmin';
import AddItem from './src/components/AddItem';
import RemoveItem from './src/components/RemoveItem';
import ListItem from './src/components/ListItem';
import VerifyAcc from './src/components/VerifyAcc';
import LowStock from './src/components/LowStock';
import AddStock from './src/components/AddStock';
import SubtractStock from './src/components/SubtractStock';
import ListStock from './src/components/ListStock';

const Stack = createStackNavigator();

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen name="Login"
                        component={LoginPage}
                        options={{ headerShown: false }} />
                    <Stack.Screen name="Register" 
                        component={RegisterPage} />
                    <Stack.Screen name="Homepage Worker"
                        component={HomepageWorker}
                        options={{ headerShown: false }} />
                    <Stack.Screen name="Homepage Admin"
                        component={HomepageAdmin}
                        options={{ headerShown: false }} />

                    <Stack.Screen name="Tambah Barang"
                        component={AddItem}
                        options={{ headerStyle: { backgroundColor: '#428bca' }, headerTintColor: "#f9f9f9" }} />
                    <Stack.Screen name="Hapus Barang"
                        component={RemoveItem}
                        options={{ headerStyle: { backgroundColor: '#428bca' }, headerTintColor: "#f9f9f9" }} />
                    <Stack.Screen name="Daftar Barang"
                        component={ListItem}
                        options={{ headerStyle: { backgroundColor: '#428bca' }, headerTintColor: "#f9f9f9" }} />
                    <Stack.Screen name="Verifikasi Akun"
                        component={VerifyAcc}
                        options={{ headerStyle: { backgroundColor: '#428bca' }, headerTintColor: "#f9f9f9" }} />
                    <Stack.Screen name="Stok Rendah"
                        component={LowStock}
                        options={{ headerStyle: { backgroundColor: '#428bca' }, headerTintColor: "#f9f9f9" }} />

                    <Stack.Screen name="Tambah Stok"
                        component={AddStock}
                        options={{ headerStyle: { backgroundColor: '#428bca' }, headerTintColor: "#f9f9f9" }} />
                    <Stack.Screen name="Kurangi Stok"
                        component={SubtractStock}
                        options={{ headerStyle: { backgroundColor: '#428bca' }, headerTintColor: "#f9f9f9" }} />
                    <Stack.Screen name="Lihat Stok"
                        component={ListStock}
                        options={{ headerStyle: { backgroundColor: '#428bca' }, headerTintColor: "#f9f9f9" }} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}