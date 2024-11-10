import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabNavigator from './MainTabNavigator';
import MemberNavigator from './Stack/MemberNavigator';
import CounselNavigator from './Stack/CounselNavigator';
import RecordNavigator from './Stack/RecordNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import CounterScreen from '../screens/CounterScreen';

const Stack = createStackNavigator();

function MainStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Member" component={MemberNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Counsel" component={CounselNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Record" component={RecordNavigator} options={{ headerShown: false }} />
      {/* 예시 */}
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Counter" component={CounterScreen} />
    </Stack.Navigator>
  );
}

export default MainStackNavigator;
