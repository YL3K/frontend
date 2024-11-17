import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const WaitingModal = ({ visible, onCancel, onClose }) => {
  const [waitingCount, setWaitingCount] = useState(0);

  // waitingCount 대기열 api에서 조회해서 띄우기 + 주기적으로 
  useEffect(()=>{

  })

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View>
            <Text style={[styles.text, {marginBottom:5}]}>상담사와 연결 중입니다.</Text>
            <Text style={styles.text}>잠시만 기다려주세요.</Text>
          </View>

          <View>
            <Text style={styles.text}>현재 대기 인원</Text>
            <Text style={styles.waitingCount}>{waitingCount}명</Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button style={[styles.button, styles.cancelButton]} onPress={onCancel} text="상담 취소" />
            <Button style={[styles.button, styles.closeButton]} onPress={onClose} text="창 닫기" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const Button = ({ style, onPress, text }) => (
  <TouchableOpacity style={style} onPress={onPress}>
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    height: 280,
    backgroundColor: 'white',
    justifyContent: 'space-between', 
    flexDirection: 'column',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    fontSize: 13,
    textAlign: 'center',
  },
  spinnerContainer: {
    marginBottom: 20,
  },
  waitingCount: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFD400',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#DDD',
    marginRight: 5,
  },
  closeButton: {
    backgroundColor: '#FFD400',
    marginLeft: 5,
  },
  buttonText: {
    fontSize: 13,
  },
});

export default WaitingModal;