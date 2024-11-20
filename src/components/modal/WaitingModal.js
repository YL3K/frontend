import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

const WaitingModal = ({ isVisible, onCancel, onClose, waitingQueue, user }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      isVisible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View>
            <Text style={[styles.waitingTitleText, {marginBottom:5}]}>상담사와 연결 중입니다 😀</Text>
            <Text style={styles.text}>잠시만 기다려주세요 🙏</Text>
          </View>

          <View>
            <Text style={styles.waitingTitleText}>현재 대기 인원</Text>
            <View style={styles.waitingText}>
              <Text style={styles.waitingCount}>{waitingQueue.length}</Text>
              <Text style={styles.text}> 명 중 </Text>
              <Text style={styles.waitingCount}>{waitingQueue.findIndex(item => item.userId === user.userId) + 1}</Text>
              <Text style={styles.text}> 번째</Text>
            </View>
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size={220} color="#FFCC00" />
            </View>
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
    height: 400,
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
  loadingWrapper: {
    position: 'absolute',
    top: -25,
    left: -2.5,
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitingTitleText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5
  },
  waitingText: {
    flexDirection: 'row', // 가로 배치
    justifyContent: 'center', // 가운데 정렬
    alignItems: 'center', // 세로 정렬
    marginBottom: 20, // 하단 여백 추가
  },
  waitingCount: {
    fontSize: 23,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFD400',
    // marginBottom: 20,
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