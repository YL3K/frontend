import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ReusableModal from '../../components/modal/ReusableModal';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loadUser } from '../../actions/userActions';
import { setFcmToken } from '../../actions/fcmTokenActions';
import messaging from '@react-native-firebase/messaging';

function LoginScreen({ navigation }) {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isFailModalVisible, setFailModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async () => {
    // 로그인 실패 시 모달 표시
    if (loginId === '' || password === '') {
      setFailModalVisible(true);
    } else {
      try {
        const response = await axios.post('http://10.0.2.2:8080/auth/login', {
          loginId,
          password,
        });
        const userInfo = response.data.response.data;

        console.log(userInfo.accessToken);
  
        setUserInfo(userInfo);
        // 토큰을 저장하고, Redux에 사용자 정보 저장
        dispatch(loadUser(userInfo));

        const token = await messaging().getToken();
        dispatch(setFcmToken(token));

        console.log('로그인 성공');
        
        if (userInfo.userType === 'customer') {
          navigation.navigate('Main'); // 고객은 Main 화면으로 이동
        } else if (userInfo.userType === 'counselor') {
          navigation.navigate('Counsel'); // 상담사는 CounselWaiting 화면으로 이동
        }
      } catch (error) {
        // console.error('로그인 실패:', error);
        setFailModalVisible(true);
      }
    }
  };

  const closeModal = () => {
    if(isFailModalVisible) {
      setFailModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>안녕하세요</Text>
      <Text style={styles.subtitle}>서비스 이용을 위해 먼저 로그인을 진행해주세요.</Text>

      {/* User ID Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="아이디"
          value={loginId}
          onChangeText={setLoginId}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
        />
        {/* 가시성 토글 아이콘 */}
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Icon
            name={isPasswordVisible ? 'visibility' : 'visibility-off'} // 아이콘 변경
            size={20}
            style={styles.icon}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <Text style={styles.footerText}>
        KB 스타후르츠뱅크가 처음이신가요?{' '}
        <Text style={styles.signUpLink} onPress={() => navigation.navigate('SignUp')}>회원가입</Text>
      </Text>

      {/* 실패 모달 */}
      {isFailModalVisible && (
        <ReusableModal
          isVisible={isFailModalVisible}
          onClose={closeModal}
          title="로그인 실패"
          content="로그인에 실패하였습니다.<br/>다시 시도해주시기 바랍니다."
        />
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    color: '#313131',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 13.5,
    color: '#727272',
    marginBottom: 20,
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#313131',
    marginBottom: 15,
    padding: 3,
    borderRadius: 5
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 12,
    padding: 10,
    paddingLeft: 20
  },
  icon: {
    marginRight: 20,
  },
  button: {
    backgroundColor: '#FFCC00',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#313131',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 5
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  signUpLink: {
    color: '#727272',
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
});

export default LoginScreen;