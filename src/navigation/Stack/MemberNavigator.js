import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainStackNavigator from '../MainStackNavigator.js';
import CounselMainStackNavigator from '../CounselMainStackNavigator.js';
import LoginScreen from '../../screens/member/LoginScreen';
import SignUpScreen from '../../screens/member/SignUpScreen';
import ConfirmScreen from '../../screens/member/ConfirmScreen';
import MyPageScreen from '../../screens/member/MyPageScreen';
import LogoHeader from '../../components/header/LogoHeader';
import { useSelector } from 'react-redux';

const Stack = createStackNavigator();

function MemberNavigator() {
  const user = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return (
    <Stack.Navigator
      initialRouteName={isLoggedIn ? ( user.userType === "customer" ? "CustomerMain" : "CounselMain" ) : "Login"}
      screenOptions={{
        header: (props) => <LogoHeader {...props} />,
        headerShown: true
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="CustomerMain" component={MainStackNavigator} options={{headerShown: false}}/>
      <Stack.Screen name="CounselMain" component={CounselMainStackNavigator}/>
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Confirm" component={ConfirmScreen}/>
      <Stack.Screen name="Mypage" component={MyPageScreen} />
    </Stack.Navigator>
  );
}

export default MemberNavigator;
