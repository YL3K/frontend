// 상담 종료 페이지
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import MainButton from '../../components/button/MainButton';
import SummaryProgress from '../../components/SummaryProgress';
import SummaryComplete from '../../components/SummaryComplete';

function EndSessionScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={{ uri: 'https://kr.object.ncloudstorage.com/kbsf-image/image1.jpg' }}
          style={styles.profileImage}
        />
        <Text style={styles.nameContainer}>
          <Text style={styles.nameText}>김재동 </Text>
          <Text>상담사</Text>
        </Text>
        <Text style={styles.statusText}>상담이 종료되었습니다.</Text>
        <View style={styles.summaryContainer}>
          {/* <SummaryProgress /> */}
          <SummaryComplete />
        </View>
      </View>
      {/* <View>
        <MainButton
          title="홈 화면으로 이동"
          style={styles.homeButton}
        >  
        </MainButton>
      </View> */}
      <View style={styles.buttonContainer}>
        <MainButton
          title="홈 화면"
          backgroundColor="#FFFFFF"
          style={styles.button}
        />
        <MainButton
          title="상담 요약 이동"
          style={styles.button}
        />
      </View>
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