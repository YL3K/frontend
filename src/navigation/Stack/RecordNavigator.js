import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RecordListScreen from '../../screens/Record/RecordListScreen';
import RecordDetailScreen from '../../screens/Record/RecordDetailScreen';

const Stack = createStackNavigator();

function RecordNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="RecordList" component={RecordListScreen} options={{headerShown: false}} />
      <Stack.Screen name="RecordDetail" component={RecordDetailScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

export default RecordNavigator;
