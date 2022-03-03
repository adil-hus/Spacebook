import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SearchScreen from './Search';
import FriendRequestsScreen from './FriendRequests';
import AccountScreen from './Account';
import StackNav2 from './StackNav2';

const Tab = createBottomTabNavigator();

function RestOfAppScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={StackNav2} />        
      <Tab.Screen name="Search" component={SearchScreen} options={{headerShown:false}} />
      <Tab.Screen name="Friend Requests" component={FriendRequestsScreen} />
      <Tab.Screen name="Friends" component={StackNav2} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default RestOfAppScreen;