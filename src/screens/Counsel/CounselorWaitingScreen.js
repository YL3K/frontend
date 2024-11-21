import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import checked from '../../../assets/check.png'
import unchecked from '../../../assets/uncheck.png'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomerAndCounselor } from '../../actions/counselActions';
import { loadUser } from '../../actions/userActions';




function CounselorWaitingScreen({ navigation }) {

  const user = useSelector((state) => state.user?.user);
  const userId = useSelector((state) => state.user.user?.userId);
  const counselorName = useSelector((state) => state.user.user?.userName);
  const [waitingQueue, setWaitingQueue] = useState([]); // 대기열 상태


    const fetchMonthlyConsultationCount = async (year, month) => {
        try {
            const response = await axios.get(
                `http://10.0.2.2:8080/api/record/monthCount?choiceDate=${year}-${String(month).padStart(2, '0')}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`,
                    },
                }
            );
            return response.data.response.data.count;
        } catch (error) {
            console.error('Error fetching monthly consultation count:', error);
            return 0;
        }
    };

    const fetchRecentCustomer = async () => {
        try {
            const response = await axios.get('http://10.0.2.2:8080/api/record/recentCustomer', {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`,
                },
            });
            return response.data.response.data;
        } catch (error) {
            console.error('Error fetching recent customer:', error);
            return { customerName: '', customerDate: '' };
        }
    };

    const formatDate = (isoDateString) => {
        const date = new Date(isoDateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year} / ${month} / ${day}`; // 원하는 출력 형식대로 수정 가능
    };


  // 컴포넌트가 마운트될 때 WebSocket 연결 설정
  useEffect(() => {
    const socket = new WebSocket('ws://10.0.2.2:8080/ws'); // 서버 WebSocket URL

    // WebSocket 연결이 열렸을 때 처리
    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    // 서버에서 메시지를 받을 때 처리
    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
      // 대기열 상태가 변경되었을 때 상태 업데이트
      if (message.type === 'queue_update') {
        console.log("대기열 업데이트");
        await getWaitingListAPI();
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

  // 2.상담사 폰화면
    const [year, setYear] = useState(null);
    const [month, setMonth] = useState(null);
    const userInform = useSelector((state) => state.user).user;
    const [isCameraChecked, setIsCameraChecked] = useState(false);
    const [isMicChecked, setIsMicChecked] = useState(false);
    const [isQueueAvailable, setIsQueueAvailable] = useState(false); 
    const [isStartButtonEnabled, setIsStartButtonEnabled] = useState(false);
    const dispatch = useDispatch();

    const [waitingList, setWaitingList] = useState([]); 
    const [consultationsThisMonth, setConsultationsThisMonth] = useState(0); // 월별 상담 건수
    const [recentCustomer, setRecentCustomer] = useState({ customerName: '', customerDate: '' }); // 최근 상담 고객


    useEffect(() => {
        const initializeData = async () => {
          const date = new Date();
          const currentYear = date.getFullYear();
          const currentMonth = date.getMonth() + 1;
      
          setYear(currentYear);
          setMonth(currentMonth);
      
          // 월별 상담 수와 최근 상담 데이터 가져오기
          const count = await fetchMonthlyConsultationCount(currentYear, currentMonth);
          setConsultationsThisMonth(count);
      
          const recentCustomer = await fetchRecentCustomer();
          setRecentCustomer(recentCustomer);
        };
      
        initializeData();
        requestPermissions(); // 권한 요청
      }, []);
      

    useEffect(() => {
        setIsStartButtonEnabled(isCameraChecked && isMicChecked && isQueueAvailable);
    }, [isCameraChecked, isMicChecked, isQueueAvailable])

    const requestPermissions = async () => {
        const cameraPermission = Platform.select({
            ios: PERMISSIONS.IOS.CAMERA, android: PERMISSIONS.ANDROID.CAMERA,
        });
        
        const micPermission = Platform.select({
            ios: PERMISSIONS.IOS.MICROPHONE, android: PERMISSIONS.ANDROID.RECORD_AUDIO,
        });

        const checkAndRequestPermission = async (permission, setState) => {
            const status = await check(permission);
            if (status === RESULTS.GRANTED) {
              setState(true);
            } else {
              const requestStatus = await request(permission);
              setState(requestStatus === RESULTS.GRANTED);
            }
        };

        await checkAndRequestPermission(cameraPermission, setIsCameraChecked);
        await checkAndRequestPermission(micPermission, setIsMicChecked);
    }
  
    const handlePreviousMonth = async () => {
        const newMonth = month === 1 ? 12 : month - 1;
        const newYear = month === 1 ? year - 1 : year;
      
        setMonth(newMonth);
        setYear(newYear);
      
        // 월별 상담 수 갱신
        const count = await fetchMonthlyConsultationCount(newYear, newMonth);
        setConsultationsThisMonth(count);
      };
      
      const handleNextMonth = async () => {
        const newMonth = month === 12 ? 1 : month + 1;
        const newYear = month === 12 ? year + 1 : year;
      
        setMonth(newMonth);
        setYear(newYear);
      
        // 월별 상담 수 갱신
        const count = await fetchMonthlyConsultationCount(newYear, newMonth);
        setConsultationsThisMonth(count);
      };
      

    const handleCustomerAssign = async () => {
        await customerAssignAPI();
        navigation.navigate('VideoConsult')
    }
    
    const customerAssignAPI = async () => {
        try {
          const response = await axios.post('http://10.0.2.2:8080/api/v1/counsel/queue/assign', {}, {
            headers: {
              Authorization: `Bearer ${user.accessToken}`  // 토큰을 Authorization 헤더에 넣기
            }});
            const customerId = response.data.response.data.userId
            const counselorId = userInform.userId
            dispatch(setCustomerAndCounselor(customerId, counselorId));
        } catch (error) {
          console.error(error);
        }  
    };

    const getWaitingListAPI = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:8080/api/v1/counsel/queue', {
            headers: {
              Authorization: `Bearer ${user.accessToken}`  // 토큰을 Authorization 헤더에 넣기
            }
        });

        const waitingData = response.data.response.data;
        console.log(waitingData);
        setWaitingList(waitingData);
        if (waitingData.length >= 1) {
            setIsQueueAvailable(true);
        }
    
      } catch (error) {
          console.error(error);
      }  
    };

    // 시간을 경과 시간 형식으로 변환하는 함수
    const getElapsedTime = (startTime) => {
      const start = new Date(startTime); // 클라이언트의 대기 시작 시간
      const now = new Date(); // 현재 시간
      const diff = Math.floor((now - start) / 1000); // 시간 차이 (초 단위)

      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      if (hours > 0) {
          return `${hours}시간 ${minutes}분째`;
      } else if (minutes > 0) {
          return `${minutes}분째`;
      } else {
          return `${seconds}초째`;
      }
    };

    useEffect(() => {
      // 1초 간격으로 경과 시간 업데이트
      const timer = setInterval(() => {
          setWaitingList((prevList) =>
              prevList.map((client) => ({
                  ...client,
                  elapsedTime: getElapsedTime(client.startTime),
              }))
          );
      }, 1000);

      return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
    }, []);
      

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity  style={styles.header} onPress={() => navigation.navigate('Mypage')}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20}}>
                    {counselorName} 상담사님
                </Text>
            </TouchableOpacity>
        
            <View style={styles.containerBox}>
                <Text>월별 상담 횟수</Text>
                <View style={styles.monthlyConsultation}>
                    <TouchableOpacity onPress={handlePreviousMonth}>
                        <Icon name="chevron-left" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.monthText}>{year}년 {month}월</Text>
                    <TouchableOpacity onPress={handleNextMonth}>
                        <Icon name="chevron-right" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.consultationCount}>{consultationsThisMonth}건</Text>
                </View>
            </View>


            <View style={styles.containerBox}>
                <Text style={styles.titleText}>최근 상담목록</Text>
                <View style={styles.rowItem}>
                    <Text>{recentCustomer.customerName}</Text>
                    <Text>{recentCustomer.customerDate ? formatDate(recentCustomer.customerDate) : ''}</Text>
                </View>
            </View>


            <View style={[styles.rowItem, {marginTop: 10, marginBottom: 10}]}>
                <CheckItem label="카메라 체크" isChecked={isCameraChecked} />
                <CheckItem label="마이크 체크" isChecked={isMicChecked} />
                <CheckItem label="대기열 배정" isChecked={isQueueAvailable} />
            </View>

            <TouchableOpacity style={[
                styles.startButton,
                {backgroundColor : isStartButtonEnabled ? '#ffd700' : '#d3d3d3'},
                ]}
                onPress={handleCustomerAssign}
                disabled={!isStartButtonEnabled}
            >
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>화상 상담 시작</Text>
            </TouchableOpacity>

            <View style={styles.containerBox}>
                <Text style={styles.titleText}>화상 상담 대기열</Text>
                {waitingList?.map((client, index) => (
                <View key={index+1} style={[styles.rowItem, {marginTop:10}]}>
                    <Text>{index+1}. {client.userName}</Text>
                    <Text>대기시간 {client.elapsedTime}</Text>
                </View>
            ))}
        </View>
        </ScrollView>
    );
}

const CheckItem = ({ label, isChecked }) => (
    <View style={{alignItems: 'center'}}>
        <Image source={isChecked ? checked : unchecked} />
        <Text style={{marginTop: 10}}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        padding: 30,
        backgroundColor: '#f5f5f5',
    },
    monthlyConsultation: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingleft : 20,
        paddingRight: 20
    },
    containerBox: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    rowItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    startButton: {
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10
    },
});

export default CounselorWaitingScreen;