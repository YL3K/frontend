import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Modal, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import WaitingModal from '../modal/WaitingModal';

const HomeHeader = () => {
  const [isCounselingStarted, setIsCounselingStarted] = useState(false); // 상담 시작 여부 상태 관리
  const [modalVisible, setModalVisible] = useState(false); // 모달 표시 여부 상태 관리
  const [waitingModalVisible, setWaitingModalVisible] = useState(false); // 대기열 모달

  const navigation = useNavigation();

  // 상담 버튼 클릭 시 처리
  const handleCounseling = () => {
    setModalVisible(true); // 모달을 열어서 상담 시작/종료 버튼을 보여줍니다.
    console.log("상담 버튼");
    if(isCounselingStarted) {
      setModalVisible(false);
      setWaitingModalVisible(true);
    }
  };

  // 상담 시작 버튼 클릭 시 처리
  const handleStartCounseling = () => {
    setIsCounselingStarted(true); // 상담 시작 상태로 변경
    setModalVisible(false); // 상담 시작 후 모달 닫기
    setWaitingModalVisible(true);
    console.log("상담 시작");
    // navigation.navigate('Counsel', {screen:'CounselorWaitingScreen'});
  };

  // 상담 취소 버튼 클릭 시 처리
  const handleCencelCounseling = () => {
    setIsCounselingStarted(false); // 상담 취소 상태로 변경
    setModalVisible(false); // 상담 종료 후 모달 닫기
    console.log("상담 취소");
  };

  const handleCancel = () => {
    handleCencelCounseling();
    setWaitingModalVisible(false);
    console.log('상담 취소');
  };

  const handleClose = () => {
    setWaitingModalVisible(false);
    console.log('창 닫기');
  };

  return (
    <View style={styles.headerContainer}>
      {/* 알림 버튼 */}
      <TouchableOpacity style={styles.iconButton}>
        <Icon name="notifications" size={24} color="#000000" />
      </TouchableOpacity>

      {/* 상담 버튼 */}
      <TouchableOpacity
        style={[styles.iconButton, isCounselingStarted ? styles.counselingStarted : null]} // 상태에 따라 색상 변경
        onPress={handleCounseling}
      >
        <Icon name="headset-mic" size={24} color="#000000" />
        {/* 상담 버튼 주변에 로딩 애니메이션 */}
        {isCounselingStarted && (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color="#FFCC00" />
          </View>
        )}
      </TouchableOpacity>

      

      {/* 메뉴 버튼 */}
      <TouchableOpacity style={styles.iconButton}>
        <Icon name="menu" size={24} color="#000000" />
      </TouchableOpacity>

      {/* 상담 버튼 하위 버튼을 모달로 표시 */}
      <Modal
        visible={modalVisible}
        animationType="fade" // 모달 애니메이션 설정
        transparent={true} // 배경 투명하게
        onRequestClose={() => setModalVisible(false)} // 뒤로가기 버튼 눌렀을 때 처리
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContentWrapper}>
          <View style={styles.modalContent}>
            {/* 상담 시작 버튼이 화면에 나타남 */}
            {!isCounselingStarted && (
              <TouchableOpacity onPress={handleStartCounseling} style={styles.button}>
                <Text>상담 시작</Text>
              </TouchableOpacity>
            )}

            {/* 상담 종료 버튼이 화면에 나타남 (상담 시작 후) */}
            {isCounselingStarted && (
              <TouchableOpacity onPress={handleCencelCounseling} style={styles.button}>
                <Text>대기 종료</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* 대기열 입장 모달 */}
      {waitingModalVisible && (
        <WaitingModal 
          isVisible={waitingModalVisible}
          onCancel={handleCancel}
          onClose={handleClose}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#EEF3F9',
  },
  iconButton: {
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 100,
    position: 'relative',
  },
  counselingStarted: {
    backgroundColor: '#FFCC00',
  },
  loadingWrapper: {
    position: 'absolute',
    top: -7,
    left: -8,
    width: 40,
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContentWrapper: {
    position: 'absolute',
    top: 50, // 상담 버튼 아래에 위치하도록 설정
    right: 50,
    zIndex: 1, // 모달이 다른 컴포넌트 위에 오도록 설정
  },
  modalContent: {
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});

export default HomeHeader;