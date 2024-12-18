import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../../screens/member/LoginScreen';
import SignUpScreen from '../../screens/member/SignUpScreen';
import ConfirmScreen from '../../screens/member/ConfirmScreen';
import MyPageScreen from '../../screens/member/MyPageScreen';

const Stack = createStackNavigator();

function MemberNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Confirm" component={ConfirmScreen} />
      <Stack.Screen name="Mypage" component={MyPageScreen} />
    </Stack.Navigator>
  );
}

export default MemberNavigator;
