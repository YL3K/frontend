import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabNavigator from './MainTabNavigator';
import CounselNavigator from './Stack/CounselNavigator';
import RecordNavigator from './Stack/RecordNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import CounterScreen from '../screens/CounterScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import LogoHeader from '../components/header/LogoHeader';

const Stack = createStackNavigator();

function MainStackNavigator() {

  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <LogoHeader {...props} />,
      }}
    >
      <Stack.Screen name="Main" component={MainTabNavigator} options={{headerShown: false}}/>
      <Stack.Screen name="Counsel" component={CounselNavigator} />
      <Stack.Screen name="Record" component={RecordNavigator} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Counter" component={CounterScreen} />
      <Stack.Screen name="Analysis" component={AnalysisScreen} />
    </Stack.Navigator>
  );
}

export default MainStackNavigator;
