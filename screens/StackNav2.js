import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './Home';
import ViewSinglePostScreen from './ViewSinglePost';

const Stack = createNativeStackNavigator();

function StackNav2() {
  return (
  
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}} />
        <Stack.Screen name="ViewSinglePost" component={ViewSinglePostScreen} options={{headerShown:false}} />
      </Stack.Navigator>
 
  );
}

export default StackNav2;