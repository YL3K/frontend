import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

// 대기열 데이터를 실시간으로 받아오는 컴포넌트
const WaitingQueueScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user.user);
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
      // const message = event.data;
      const message = JSON.parse(event.data); // 서버에서 보낸 메시지 파싱
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
        
        navigation.navigate('Counsel', {screen:'VideoConsult'});
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
  }, []); // 빈 배열을 전달하면 컴포넌트가 처음 마운트될 때만 실행됩니다.

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

      console.log(response.data.response.data);


    } catch (error) {
      console.error(error);
    }  
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Waiting Queue</Text>
      <FlatList
        data={waitingQueue}
        renderItem={({ index, item }) => (
          <View style={styles.queueItem}>
            <Text>{`User ID: ${item.userId}, Position: ${index + 1}`}</Text>
          </View>
        )}
        keyExtractor={(item) => item.userId.toString()}
      />
       <Text>내 순서는 전체 {waitingQueue.length}명 중 {waitingQueue.findIndex(item => item.userId === user.userId) + 1}번째 입니다.</Text>
      <Button title="Add Customer" onPress={handleAddCustomer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  queueItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 5,
  },
});

export default WaitingQueueScreen;
