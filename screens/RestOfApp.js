import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SearchScreen from './Search';
import FriendRequestsScreen from './FriendRequests';
import StackNav2 from './StackNav2';
import StackNav3 from './StackNav3';
import StackNav4 from './StackNav4';

const Tab = createBottomTabNavigator();

function RestOfAppScreen() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={StackNav2} />        
            <Tab.Screen name="Search" component={SearchScreen} options={{headerShown:false}} />
            <Tab.Screen name="Friend Requests" component={FriendRequestsScreen} />
            <Tab.Screen name="Friends" component={StackNav4} />
            <Tab.Screen name="Account" component={StackNav3} options={{headerShown:false}} />
        </Tab.Navigator>
    );
}

export default RestOfAppScreen;