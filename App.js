import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginPage from './src/screens/LoginPage';
import RegisterPage from './src/screens/RegisterPage';
import HomePage from './src/screens/HomePage';

const Stack = createStackNavigator();

export default function App() {
    return (
        <SafeAreaProvider>  
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen name="Login" component={LoginPage} options={{headerShown: false}} />
                    <Stack.Screen name="Register" component={RegisterPage} />
                    <Stack.Screen name="Home Page" component={HomePage} options={{headerShown: false}} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}