// SignUpScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

function SignUpScreen({ navigation }) {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConfirmVisible, setConfirmVisible] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordLengthError, setPasswordLengthError] = useState('');

  const [userName, setUserName] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [loginIdError, setLoginIdError] = useState('');
  const [isloginIdAvailable, setIsloginIdAvailable] = useState(false);

  const [nullErrorMsg, setNullErrorMsg] = useState(null);

  const handleloginIdCheck = async () => {
    // 예시: 아이디 중복 체크 로직 (실제 구현 시 API 호출 필요)
    if (loginId.length < 5) {
      setLoginIdError('아이디는 5자 이상이어야 합니다');
      setIsloginIdAvailable(false);
    } else {
      try {
        // 아이디 중복체크 API 호출
        const response = await axios.get(`http://10.0.2.2:8080/auth/check/loginid?loginId=${loginId}`);
        console.log(response.data);
        // API 응답에 따라 처리
        if (response.status === 200 && response.data.success) {
          setLoginIdError('사용가능한 아이디입니다.');
          setIsloginIdAvailable(true);
        } else {
          setLoginIdError('이미 사용 중인 아이디입니다.');
          setIsloginIdAvailable(false);
        }
      } catch (error) {
        // 오류 처리
        console.error('아이디 중복 확인 실패:', error);
        setLoginIdError('아이디 중복 확인 중 문제가 발생했습니다.');
        setIsloginIdAvailable(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmVisibility = () => {
    setConfirmVisible(!isConfirmVisible);
  };

  useEffect(() => {
    if (confirmPassword && confirmPassword !== password) {
      setPasswordError('비밀번호가 일치하지 않습니다');
    } else {
      setPasswordError('');
    }
  }, [confirmPassword, password]);

  const handlePasswordChange = (newPassword) => {
    setPassword(newPassword);
    if (newPassword.length < 8) {
      setPasswordLengthError('비밀번호는 8자 이상이어야 합니다');
    } else {
      setPasswordLengthError('');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(Platform.OS === 'ios' ? true : false); // iOS에서만 피커가 숨겨지지 않도록 설정
    setBirthDate(currentDate); // 선택한 날짜로 상태 업데이트
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month and ensure two digits
    const day = String(date.getDate()).padStart(2, '0'); // Get day and ensure two digits
  
    return `${year}-${month}-${day}`;
  };

  const confirmNullCheck = () => {
    if(!loginId || !password || !userName || !birthDate) {
      setNullErrorMsg('고객 정보를 모두 입력해주세요.');
    }
    else {
      
      if(isloginIdAvailable && !passwordError) {
        setNullErrorMsg('');

        const formattedBirthDate = formatDate(birthDate);

        navigation.navigate('Confirm', {
          loginId,
          password,
          userName,
          birthDate: formattedBirthDate
        });
      }
      else {
        if(!isloginIdAvailable) {
          setNullErrorMsg('고객 정보를 올바르게 입력해주세요');
        }
        else {
          setNullErrorMsg('잘못된 정보를 수정해주세요');
        }
        
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      <Text style={styles.subtitle}>고객님의 정보를 입력해주세요.</Text>
      
      {/* User ID Input */}
      <Text style={styles.inputName}>아이디</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="5자 이상 입력해주세요"
          value={loginId}
          onChangeText={setLoginId}
        />

        <TouchableOpacity style={styles.checkButton} onPress={handleloginIdCheck}>
          <Text style={styles.checkButtonText}>중복확인</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.checkMsg}>{loginIdError ? loginIdError : null}</Text>

      {/* Password Input */}
      <Text style={styles.inputName}>비밀번호</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="8자 이상 입력해주세요"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Icon
            name={isPasswordVisible ? 'visibility' : 'visibility-off'} // 아이콘 변경
            size={20}
            style={styles.icon}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <Text style={styles.inputName}>비밀번호 확인</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!isConfirmVisible}
        />
        <TouchableOpacity onPress={toggleConfirmVisibility}>
          <Icon
            name={isConfirmVisible ? 'visibility' : 'visibility-off'} // 아이콘 변경
            size={20}
            style={styles.icon}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.error}>{passwordError ? passwordError : null}{'\n'}{passwordLengthError ? passwordLengthError : null}</Text>
      {/* Name Input */}
      <Text style={styles.inputName}>이름</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="실명을 입력해주세요"
          value={userName}
          onChangeText={setUserName}
        />
      </View>
      
      {/* birthDate Input */}
      <Text style={styles.inputName}>생년월일</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <View style={styles.inputDateContainer}>
          <Icon name="calendar-today" size={20} color="#666" style={styles.dateIcon} />
          <TextInput
            style={styles.input}
            placeholder="생년월일을 선택해주세요"
            value={birthDate?.toLocaleDateString()} // 날짜를 문자열로 변환하여 표시
            editable={false} // 텍스트 필드가 수정되지 않도록 설정
          />
        </View>
      </TouchableOpacity>
      

      <Text style={styles.error}>{nullErrorMsg}</Text>
      
      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={birthDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.button} onPress={confirmNullCheck}>
        <Text style={styles.buttonText}>계속하기</Text>
      </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderColor: '#313131',
    marginBottom: 15,
    padding: 3
  },
  inputDateContainer: {
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
  inputName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    fontWeight: 'bold'
  },
  icon: {
    marginRight: 20,
  },
  dateIcon: {
    marginLeft: 10,
  },
  error: {
    color: 'red',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 20,
    height: 40
  },
  checkMsg: {
    color: 'red',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: -10,
    marginBottom: 15
  },
  checkButton: {
    backgroundColor: '#D9D9D9',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#313131',
  }
});

export default SignUpScreen;