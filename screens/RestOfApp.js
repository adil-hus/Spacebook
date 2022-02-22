import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import FriendsListScreen from './FriendsList';
import ProfileScreen from './MyProfile';
import FriendRequestsScreen from './FriendRequests';

const Tab = createBottomTabNavigator();

function RestOfAppScreen() {
  return (
      <Tab.Navigator>        
        <Tab.Screen name="MyProfile" component={ProfileScreen} />
        <Tab.Screen name="FriendsList" component={FriendsListScreen} />
        <Tab.Screen name="FriendRequests" component={FriendRequestsScreen} />
      </Tab.Navigator>
  );
}

export default RestOfAppScreen;