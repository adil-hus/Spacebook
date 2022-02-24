// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/Home';
import LoginScreen from './screens/Login';
import SignupScreen from './screens/Signup';
import RestOfAppScreen from './screens/RestOfApp';
import LogoutScreen from './screens/Logout';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="RestOfApp" component={RestOfAppScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Logout" component={LogoutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}

export default App;