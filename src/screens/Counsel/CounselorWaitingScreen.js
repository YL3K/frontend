import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import checked from '../../../assets/check.png'
import unchecked from '../../../assets/uncheck.png'
import { useSelector } from 'react-redux';
import axios from 'axios';

function CounselorWaitingScreen({ navigation }) {
    const user = useSelector((state) => state.user.user);
    const counselorName = '이국민';
    const [year, setYear] = useState(null);
    const [month, setMonth] = useState(null);
    const consultationsThisMonth = 151;

    const [isCameraChecked, setIsCameraChecked] = useState(false);
    const [isMicChecked, setIsMicChecked] = useState(false);
    const [isQueueAvailable, setIsQueueAvailable] = useState(false); 
    const [isStartButtonEnabled, setIsStartButtonEnabled] = useState(false);

    // 상담 대기열 (백엔드 요청할 것 -> 실시간 바뀌어야함)
    const waitingList = [
        { id: 1, name: '박*민 고객님', waitTime: '30분째' },
        { id: 2, name: '오*민 고객님', waitTime: '27분째' },
        { id: 3, name: '최*민 고객님', waitTime: '27분째' },
        { id: 4, name: '서*민 고객님', waitTime: '20분째' },
        { id: 5, name: '황*민 고객님', waitTime: '10분째' },
        { id: 6, name: '임*민 고객님', waitTime: '3분째' },
    ];

    useEffect(() => {
        const date = new Date();
        setYear(date.getFullYear()); 
        setMonth(date.getMonth() + 1); 
        // 해당 년, 달의 상담 수 갱신
        requestPermissions();
    }, [])

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
        if (waitingList.length > 1) {
            setIsQueueAvailable(true);
        }
    }
  
    const handlePreviousMonth = () => {
        setMonth(prevMonth => (prevMonth === 1 ? 12 : prevMonth - 1));
        setYear(prevYear => (month === 1 ? prevYear - 1 : prevYear));
        // 상담 수 갱신
    };
      
    const handleNextMonth = () => {
        setMonth(prevMonth => (prevMonth === 12 ? 1 : prevMonth + 1));
        setYear(prevYear => (month === 12 ? prevYear + 1 : prevYear));
        // 상담 수 갱신
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
      

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20}}>
                {counselorName} 상담사님
            </Text>
        
            <View style={styles.containerBox} >
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
                <Text style={styles.titleText}>
                    최근 상담목록
                </Text>
                <View style={styles.rowItem}>
                <Text>김*민 고객님</Text>
                <Text>2024.10.15 20:20:00</Text>
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
                {waitingList.map((client) => (
                <View key={client.id} style={[styles.rowItem, {marginTop:10}]}>
                    <Text>{client.id}. {client.name}</Text>
                    <Text>대기시간 {client.waitTime}</Text>
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