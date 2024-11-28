import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginPage from './src/screens/LoginPage';
import RegisterPage from './src/screens/RegisterPage';
import HomePage from './src/screens/HomePage';
import AddItem from './src/component/AddItem';
import RemoveItem from './src/component/RemoveItem';
import ListItem from './src/component/ListItem';

const Stack = createStackNavigator();

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen name="Login" component={LoginPage} options={{headerShown: false}} />
                    <Stack.Screen name="Register" component={RegisterPage} />
                    <Stack.Screen name="Home Page" component={HomePage} options={{headerShown: false}} />

                    <Stack.Screen name="Tambah Barang" component={AddItem} />
                    <Stack.Screen name="Hapus Barang" component={RemoveItem} />
                    <Stack.Screen name="Daftar Barang" component={ListItem} />

                    <Stack.Screen name="Tambah Stock" component={AddStock} options={{title: 'Tambah Stock Barang'}} />
                    <Stack.Screen name="Kurangi Stock" component={SubtractStock} options={{title: 'Kurangi Stock Barang'}} />
                    <Stack.Screen name="Daftar Barang au" component={ListItemWorker} options={{title: 'blm yakin ada atau engga'}} />

                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}