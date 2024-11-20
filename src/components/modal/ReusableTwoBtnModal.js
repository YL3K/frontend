import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

const ReusableTwoBtnModal = ({ isVisible, title, content, onBtnText1, onBtnAction1, onBtnText2, onBtnAction2, onClose }) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{title}</Text>
        <Text style={styles.modalMessage}>
            {/* content가 줄바꿈 포함된 텍스트일 경우 처리 */}
            {content.split('<br/>').map((line, index) => (
                <Text key={index}>
                {line}
                {'\n'}
                </Text>
            ))}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.confirmButton1} onPress={onBtnAction1}>
            <Text style={styles.confirmButtonText}>{onBtnText1}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton2} onPress={onBtnAction2}>
            <Text style={styles.confirmButtonText}>{onBtnText2}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton1: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 52.5,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  confirmButton2: {
    backgroundColor: '#FFD700',
    paddingVertical: 5,
    paddingHorizontal: 52.5,
    borderRadius: 20,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ReusableTwoBtnModal;
