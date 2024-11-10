//  로그인 페이지
import React from 'react';
import { View, Text, Button } from 'react-native';

function LoginScreen({ navigation }) {
  return (
    <View>
      <Text>Login Screen</Text>
      <Button
        title="Go to SignUp"
        onPress={() => navigation.navigate('SignUp')}
      />
      <Button
        title="Go to Confirm"
        onPress={() => navigation.navigate('Confirm')}
      />
      <Button
        title="Go to Mypage"
        onPress={() => navigation.navigate('Mypage')}
      />
    </View>
  );
}

export default LoginScreen;