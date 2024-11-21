import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Modal, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import WaitingModal from '../modal/WaitingModal';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import ReusableModal from '../modal/ReusableModal';
import ReusableTwoBtnModal from '../modal/ReusableTwoBtnModal';
import { setCustomerAndCounselor } from '../../actions/counselActions';

const HomeHeader = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // 1. HomeHeader 관련
  const [isCounselingStarted, setIsCounselingStarted] = useState(false); // 상담 시작 여부 상태 관리
  const [modalVisible, setModalVisible] = useState(false); // 모달 표시 여부 상태 관리
  const [waitingModalVisible, setWaitingModalVisible] = useState(false); // 대기열 모달
  const [connectModalVisiable, setConnectModalVisiable] = useState(false); // 대기열 입장 모달
  const [waitingCancelModalVisiable, setWaitingCancelModalVisiable] = useState(false); // 대기열 취소 안내 모달

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
  const handleStartCounseling = async () => {
    await handleAddCustomer();
    console.log("상담 시작");
  };

  // 상담 취소 버튼 클릭 시 처리
  const handleCencelCounseling = async () => {
    await handleDeleteCustomer();
    console.log("상담 취소");
  };

  const handleCancel = () => {
    handleCencelCounseling();
    setWaitingModalVisible(false);
    console.log('상담 취소');
  };

  const handleClose = () => {
    setWaitingModalVisible(false);
    console.log('waiting 창 닫기');
  };

  const handleCancelModalClose = () => {
    setWaitingCancelModalVisiable(false);
    console.log('cancel 창 닫기');
  }

  const handleConnectJoin = () => {
    // 상담방으로 연결
    setConnectModalVisiable(false);
    console.log('상담 연결');
    navigation.navigate('Counsel', {screen:'VideoConsult'});
  };

  const handleConnectCancel = () => {
    setConnectModalVisiable(false);
    // 상담 연결이 취소되었습니다. 모달 띄우기
    setWaitingCancelModalVisiable(true);
    // 상담 연결 취소
    console.log('상담 취소');
    handleCancel();
  };


  // 2. 웹소켓 관련
  const user = useSelector((state) => state.user?.user);
  const userId = useSelector((state) => state.user.user?.userId);
  const userName = useSelector((state) => state.user.user?.userName);
  const [userSessionId, setUserSessionId] = useState('');
  const [waitingQueue, setWaitingQueue] = useState([]); // 대기열 상태
  const [websocket, setWebsocket] = useState(null); // WebSocket 객체

  // 컴포넌트가 마운트될 때 WebSocket 연결 설정
  useEffect(() => {
    const socket = new WebSocket('ws://10.0.2.2:8080/ws'); // 서버 WebSocket URL

    // WebSocket 연결이 열렸을 때 처리
    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    // 서버에서 메시지를 받을 때 처리
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
      // 대기열 상태가 변경되었을 때 상태 업데이트
      if (message.userSessionId) {
        console.log("고객님의 유저아이디는 ", message.userSessionId, " 입니다.");
        setUserSessionId(message.userSessionId);
      }
      if (message.type === 'queue_update') {
        console.log("대기열 업데이트");
        const queueArray = JSON.parse(message.queue);
        setWaitingQueue(queueArray); // 대기열 상태를 화면에 업데이트
      }
      if (message.type === 'queue_assign') {
        // 여기서 받아올때
        // 모든 변수 초기화
        setWaitingModalVisible(false);
        console.log(message.counselorId) 
        // 이동 모달 띄우기
        // 예 누르면 navigation.navigate('Counsel', {screen:'VideoConsult'});
        // 아니오 누르면 새로운 알람 뜨면서 상담이 취소되었습니다.
        setConnectModalVisiable(true);
        
        // 여기서 고객이 웹소켓 받아와야하는뎅 message.counselorId이면 얻을 수 있을듯
        const counselorId = message.counselorId
        dispatch(setCustomerAndCounselor(userId, counselorId));
      }
    };

    // WebSocket 연결이 닫혔을 때 처리
    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    // 컴포넌트가 언마운트될 때 WebSocket 연결 종료
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    // waitingQueue 상태가 업데이트될 때 로그 출력
    console.log("Updated waitingQueue:", waitingQueue);
  }, [waitingQueue]);
  
  const handleAddCustomer = async () => {
    if (!userSessionId) {
      console.error("userSessionId is not available yet.");
      return;
    }
    await addCustomerAPI();
  };

  const addCustomerAPI = async () => {
    try {
      const response = await axios.post(`http://10.0.2.2:8080/api/v1/counsel/queue?sessionId=${userSessionId}`, {}, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`  // 토큰을 Authorization 헤더에 넣기
        }
    });

      console.log(response.data);
      setIsCounselingStarted(true); // 상담 시작 상태로 변경
      setModalVisible(false); // 상담 시작 후 모달 닫기
      setWaitingModalVisible(true);

    } catch (error) {
      console.error(error);
    }  
  };

  const handleDeleteCustomer = async () => {
    if (!isCounselingStarted) {
      console.error("대기열에 존재하지 않습니다.");
      return;
    }
    await deleteCustomerAPI();
  };

  const deleteCustomerAPI = async () => {
    try {
      const response = await axios.delete(`http://10.0.2.2:8080/api/v1/counsel/queue?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`  // 토큰을 Authorization 헤더에 넣기
        }
    });

      console.log(response.data);
      setIsCounselingStarted(false); // 상담 취소 상태로 변경
      setModalVisible(false); // 상담 종료 후 모달 닫기

    } catch (error) {
      console.error(error);
    }  
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
          waitingQueue={waitingQueue}
          user={user}
        />
      )}

      {/* 화상상담 연결 확인 모달 */}
      {connectModalVisiable && (
        <ReusableTwoBtnModal
          isVisible={connectModalVisiable}
          title="화상 상담 시작"
          content={`${userName} 고객님의 상담 순서가 되었습니다.<br/>상담방에 입장하시겠습니까?`}
          onBtnText1="거절"
          onBtnAction1={handleConnectCancel}
          onBtnText2="수락"
          onBtnAction2={handleConnectJoin}
          onClose={handleConnectCancel}
        />
      )}

      {/* 화상상담 취소 모달 */}
      {waitingCancelModalVisiable && (
        <ReusableModal
          isVisible={waitingCancelModalVisiable}
          onClose={handleCancelModalClose}
          title="화상상담 취소"
          content="화상상담이 취소되였습니다."
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