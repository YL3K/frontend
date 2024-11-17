import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import WaitingModal from '../components/modal/WaitingModal';

function HomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  
  // ** 대기큐에는 사용자이름, 사용자 아이디를 넣어야 하므로 받아와야함
  const userId = 189; 
  const userName = '윤다빈'; 

  const handleShowModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const cancleCounsel = async() => {
    try {
      await axios.delete('http://10.0.2.2:8080/api/v1/counsel/queue', {
        userId,
        userName,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('화상상담 대기 취소 중 오류 발생', error);
    }
  };

  const addCounsel = async() => {
    try {
      await axios.post('http://10.0.2.2:8080/api/v1/counsel/queue', {
        userId,
        userName,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('화상상담 대기 추가 중 오류 발생', error);
    }
  };

  return (
    <View>
      <Text>Home Screen</Text>
      <Button
        title="화상상담"
        onPress={() => {
          addCounsel();
          handleShowModal();
        }}
      />
      <Button
        title="Go to Member"
        onPress={() => navigation.navigate('Member')}
      />
      <Button
        title="Go to Counsel"
        onPress={() => navigation.navigate('Counsel')}
      />
      <Button
        title="Go to Record"
        onPress={() => navigation.navigate('Record')}
      />
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('Settings')}
      />
      <Button
        title="Go to Counter"
        onPress={() => navigation.navigate('Counter')}
      />

      <View style={styles.overlay}>
        <WaitingModal
          visible={modalVisible}
          onCancel={cancleCounsel}
          onClose={handleCloseModal}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;