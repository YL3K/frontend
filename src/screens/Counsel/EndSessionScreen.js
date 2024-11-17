// 상담 종료 페이지
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import MainButton from '../../components/button/MainButton';
import SummaryProgress from '../../components/SummaryProgress';
import SummaryComplete from '../../components/SummaryComplete';

function EndSessionScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const roomId = 1; // mock data
  const counselerName = "김재동"; // mock data

  useEffect(() => {
    const requestStt = async (roomId) => {

      const formData = new FormData();
      formData.append("roomId", roomId);
      console.log(formData.getParts());

      try {
          await axios.post('http://10.0.2.2:8080/api/v1/stt/test/long', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } catch (error) {
        console.error("STT, 요약 중 오류 발생: ", error);
      } finally {
        setIsLoading(false);
      }
    }

    requestStt(roomId);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={{ uri: 'https://kr.object.ncloudstorage.com/kbsf-image/image1.jpg' }}
          style={styles.profileImage}
        />
        <Text style={styles.nameContainer}>
          <Text style={styles.nameText}>{counselerName} </Text>
          <Text>상담사</Text>
        </Text>
        <Text style={styles.statusText}>상담이 종료되었습니다.</Text>
        <View style={styles.summaryContainer}>
          {isLoading ? (
            <SummaryProgress />
          ) : (
            <SummaryComplete />
          )}
        </View>
      </View>
      {isLoading ? (
        <View>
          <MainButton
            title="홈 화면으로 이동"
            style={styles.homeButton}
            onPress={() => navigation.navigate('Main')}
          >  
          </MainButton>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
            <MainButton
            title="홈 화면"
            backgroundColor="#FFFFFF"
            style={styles.button}
            onPress={() => navigation.navigate('Main')}
          />
          <MainButton
            title="상담 요약 이동"
            style={styles.button}
            onPress={() => navigation.navigate('Record')}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    paddingVertical: 25,
    backgroundColor: '#FFFFFF',
  },
  content: {
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#000000',
    borderWidth: 1,
    marginBottom: 10,
  },
  nameContainer: {
    fontSize: 20,
    marginBottom: 5,
  },
  nameText: {
    fontWeight: 'semibold',
    textAlign: 'center',
  },
  counselerText: {
    fontWeight: 'medium',
  },
  statusText: {
    fontSize: 15,
    textAlign: 'center',
  },
  summaryContainer: {
    flex: 1,
    width: '100%',
    padding: 20,
    borderRadius: 20,
    borderColor: '#BDBDBD',
    borderWidth: 2,
    justifyContent: 'center',
    marginVertical: 30,
  },
  homeButton: {
    width: '100%',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});

export default EndSessionScreen;