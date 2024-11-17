import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ReusableModal from '../../components/modal/ReusableModal';
import axios from 'axios';

// 약관 데이터 배열
const terms = [
  {
    title: '만 14세 이상',
    content: `이용자는 만 14세 이상이어야 서비스 이용이 가능합니다. 
    1. 만 14세 미만인 경우 법정 대리인의 동의가 필요합니다.
    2. 법정 대리인의 동의 없이 가입한 경우 서비스 이용이 제한될 수 있습니다.`
  },
  {
    title: '개인정보 동의',
    content: `본 약관은 개인정보 보호를 목적으로 합니다. 
    1. 이용자가 제공한 개인정보는 법률에 따라 보호받습니다.
    2. 수집된 정보는 서비스 제공 목적에 한해 사용됩니다.
    3. (이하 1000자 이상의 약관 텍스트).`,
  },
  {
    title: '상담 기록 동의',
    content: `이용자의 상담 기록은 서비스 향상 및 개선을 위해 사용됩니다. 
    1. 상담 기록은 익명 처리되어 저장됩니다.
    2. 이용자는 언제든지 기록 삭제를 요청할 수 있습니다.
    3. (이하 1000자 이상의 약관 텍스트).`,
  },
];

function ConfirmScreen({ navigation, route }) {
  const { loginId, password, userName, birthDate } = route.params;

  const [expanded, setExpanded] = useState(null);
  const [check, setCheck] = useState(false); // 전체 동의 상태 관리
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const toggleCheck = () => {
    setCheck(!check);
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:8080/auth/signup', {
        loginId,
        password,
        userName,
        birthDate
      });

      console.log(response.data.response.data);

      setModalVisible(true);

    } catch (error) {
      console.error('회원가입 실패:', error);
    }  
  };

  const closeModal = () => {
    // setModalVisible(false);
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>약관 동의</Text>

      <ScrollView style={styles.scrollContainer}>
        {/* 전체 동의 */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={toggleCheck}
        >
          <Icon name={check ? 'check-circle' : 'radio-button-unchecked'} size={24} color="gold" />
          <Text style={styles.checkboxText}>
            전체 동의하기
          </Text>
        </TouchableOpacity>


        {/* 약관 항목들 */}
        {terms.map((term, index) => (
          <View key={index} style={styles.accordionContainer}>
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => toggleExpand(index)}
            >
              <Icon
                name={expanded === index ? 'expand-less' : 'expand-more'}
                size={24}
                color="gray"
              />
              <Text style={styles.accordionTitle}>(필수) {term.title}</Text>
            </TouchableOpacity>
            {expanded === index && (
              <View style={styles.accordionContent}>
                <Text style={styles.accordionText}>{term.content}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* 가입하기 버튼 */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          !check && { backgroundColor: '#D9D9D9' }, // 체크 안 됐을 때 비활성화 색상
        ]}
        onPress={() => handleSignUp()}
        disabled={!check} // 체크가 false면 버튼 비활성화
      >
        <Text
          style={[
            styles.submitText,
            !check && { color: '#A9A9A9' }, // 버튼 비활성화 시 텍스트 색상 변경
          ]}
        >
          가입하기
        </Text>
      </TouchableOpacity>

      <ReusableModal
        isVisible={isModalVisible}
        onClose={closeModal}
        title="회원가입 성공"
        content="회원가입에 성공하였습니다.<br/>로그인 페이지로 이동합니다."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    padding: 25,
    maxHeight: 350
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9'
  },
  checkboxText: {
    fontSize: 16,
    marginLeft: 10
  },
  accordionContainer: {
    marginBottom: 10,

    paddingBottom: 10,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accordionTitle: {
    fontSize: 12,
    marginLeft: 10,
    color: '#333',
  },
  accordionContent: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10
  },
  accordionText: {
    fontSize: 12,
    color: '#555',
    padding: 10
  },
  submitButton: {
    backgroundColor: '#FFCC00',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: '#313131',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 5
  },
});

export default ConfirmScreen;
