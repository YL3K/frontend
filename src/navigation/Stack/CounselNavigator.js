import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import VideoConsultScreen from '../../screens/Counsel/VideoConsultScreen';
import EndSessionScreen from '../../screens/Counsel/EndSessionScreen';

const Stack = createStackNavigator();

function CounselNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="VideoConsult" component={VideoConsultScreen} options={{headerShown: false}} />
      <Stack.Screen name="EndSession" component={EndSessionScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

export default CounselNavigator;
