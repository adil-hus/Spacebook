import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AccountScreen from './Account';
import CameraScreen from './Camera';


const Stack = createNativeStackNavigator();

function StackNav3() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="Account" component={AccountScreen}  />
        <Stack.Screen name="Camera" component={CameraScreen} />
      </Stack.Navigator>
  );
}

export default StackNav3;