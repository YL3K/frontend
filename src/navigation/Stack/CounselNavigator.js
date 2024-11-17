import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import VideoConsultScreen from '../../screens/Counsel/VideoConsultScreen';
import EndSessionScreen from '../../screens/Counsel/EndSessionScreen';
import CounselorWaitingScreen from '../../screens/Counsel/CounselorWaitingScreen';

const Stack = createStackNavigator();

function CounselNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CounselorWaiting" component={CounselorWaitingScreen} />
      <Stack.Screen name="VideoConsult" component={VideoConsultScreen} />
      <Stack.Screen name="EndSession" component={EndSessionScreen} />
    </Stack.Navigator>
  );
}

export default CounselNavigator;
