import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ViewFriendPostsScreen from './ViewFriendPosts';
import FriendsScreen from './Friends';

const Stack = createNativeStackNavigator();

function StackNav2() {
  return (
  
      <Stack.Navigator>
          <Stack.Screen name="Friends" component={FriendsScreen} options={{headerShown:false}} />
        <Stack.Screen name="ViewFriendPosts" component={ViewFriendPostsScreen} options={{headerShown:false}} />
      </Stack.Navigator>
 
  );
}

export default StackNav2;