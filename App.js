import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OpeningScreen from './screens/Opening';
import LoginScreen from './screens/Login';
import SignupScreen from './screens/Signup';
import RestOfAppScreen from './screens/RestOfApp';

const Stack = createNativeStackNavigator();

function App() {
    return (
        <NavigationContainer>
          <Stack.Navigator>
              <Stack.Screen name="Opening" component={OpeningScreen} options={{headerShown:false}} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="RestOfApp" component={RestOfAppScreen} options={{headerShown:false}}/>
          </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;