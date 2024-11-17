import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

const ReusableModal = ({ isVisible, title, content, onClose }) => {
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
        <TouchableOpacity style={styles.confirmButton} onPress={onClose}>
          <Text style={styles.confirmButtonText}>확인</Text>
        </TouchableOpacity>
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
  confirmButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ReusableModal;
