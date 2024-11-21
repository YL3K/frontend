import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ReusableModal from '../../components/modal/ReusableModal';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../actions/userActions'; // 액션 불러오기

function MyPageScreen({ navigation }) {
  const user = useSelector((state) => state.user.user); // Redux에서 사용자 정보 가져오기
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();

  const [isModalVisible, setModalVisible] = useState(false);

  const closeModal = () => {
    // setModalVisible(false);
    // navigation.navigate('Login');
    dispatch(logoutUser()); // 로그아웃 시 Redux 상태 초기화
    navigation.reset({
      index: 0, // 첫 번째 화면으로 설정
      routes: [{ name: 'Member', params: { screen: 'Login' } }], // 'Member'의 'Login' 화면으로 이동
    });
  };

  const handleLogout = () => {
    
    setModalVisible(true)
  };

  return (
    <View style={styles.container}>
      {/* 상단 프로필 섹션 */}
      {isLoggedIn ? (
        <View style={styles.profileContainer}>
        <Icon name="account-circle" size={100} color="#DCD9D9" style={styles.profileIcon} />
        <Text style={styles.nameText}>{user.userName}<Text style={styles.addText}>님</Text></Text>
        <Text>UserId : {user.userId}</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>내 정보 수정</Text>
        </TouchableOpacity>
      </View>
      ) : (
        <Text>로그인 해주세요</Text>
      )}

      {/* 메뉴 섹션 */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="history" size={24} color="#000" />
          <Text style={styles.menuText}>상담 내역</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="support-agent" size={24} color="#000" />
          <Text style={styles.menuText}>고객센터</Text>
        </TouchableOpacity>
      </View>

      {/* 하단 로그아웃 버튼 */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={()=>handleLogout()}
      >
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>

      <ReusableModal
        isVisible={isModalVisible}
        onClose={closeModal}
        title="로그아웃"
        content="로그아웃에 성공하였습니다.<br/>로그인 페이지로 이동합니다."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 35,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 2
  },
  addText: {
    fontSize: 16,
    fontWeight: '300',
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: '#FFD700',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 16,
    marginTop: 5
  },
  editButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  menuContainer: {
    marginTop: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuText: {
    marginLeft: 16,
    fontSize: 14,
    color: '#333',
  },
  logoutButton: {
    marginTop: 'auto',
    backgroundColor: '#FFCC00',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 50,
  },
  logoutButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 5
  }
});

export default MyPageScreen;