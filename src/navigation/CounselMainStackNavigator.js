import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CounselorWaitingScreen from '../screens/Counsel/CounselorWaitingScreen';
import VideoConsultScreen from '../screens/Counsel/VideoConsultScreen';
import EndSessionScreen from '../screens/Counsel/EndSessionScreen';

const Stack = createStackNavigator();

function CounselMainStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CounselorWaiting" component={CounselorWaitingScreen} options={{headerShown: false}} />
      <Stack.Screen name="VideoConsult" component={VideoConsultScreen} options={{headerShown: false}} />
      <Stack.Screen name="EndSession" component={EndSessionScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

export default CounselMainStackNavigator;
