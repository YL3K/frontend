// 상담 종료 페이지
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import LoadingDots from "react-native-loading-dots";
import ButtonCustom from '../../components/button/ButtonCustom';

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
          <View style={styles.dotsWrapper}>
            <LoadingDots />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryText}>현재 상담 내용이</Text>
            <Text style={styles.summaryText}>요약되고 있습니다.</Text>
          </View>
        </View>
      </View>
      <View style={styles.homeButton}>
        <ButtonCustom
          title="홈 화면으로 이동"
        >  
        </ButtonCustom>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF'
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
    marginBottom: 10
  },
  nameContainer: {
    fontSize: 20,
    marginBottom: 5
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
    marginBottom: 20,
  },
  summaryContainer: {
    flex: 1,
    width: '100%',
    padding: 20,
    borderRadius: 20,
    borderColor: '#BDBDBD',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dotsWrapper: {
    width: 100,
    marginBottom: 35,
  },
  summaryTextContainer: {
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    textAlign: 'center',

  },
  homeButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF'
  },
});

export default EndSessionScreen;