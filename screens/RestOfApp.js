import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SearchScreen from './Search';
import ProfileScreen from './MyProfile';
import FriendRequestsScreen from './FriendRequests';

const Tab = createBottomTabNavigator();

function RestOfAppScreen() {
  return (
      <Tab.Navigator>
        <Tab.Screen name="Search" component={SearchScreen} options={{headerShown:false}} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{headerShown:false}} />        
        <Tab.Screen name="Friend Requests" component={FriendRequestsScreen} />
      </Tab.Navigator>
  );
}

export default RestOfAppScreen;