import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import FriendsScreen from './Friends';
import ViewFriendPostsScreen from './ViewFriendPosts';

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