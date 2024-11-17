import React, {useState} from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

function HomeScreen({ navigation }) {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* 헤더 */}
        <TouchableOpacity  style={styles.header} onPress={() => navigation.navigate('Member', { screen: 'Mypage' })}>
          <Text style={styles.userName}>김국민</Text>
          <Text style={styles.honorific}>님</Text>
        </TouchableOpacity >

        {/* 상담 옵션 카드 */}
        <TouchableOpacity style={styles.card}>
          <View>
            <Text style={styles.cardTitle}>화상 상담과 상담 요약까지</Text>
            <Text style={styles.cardDescription}>상담 요약 레포트 제공! 이전 상담까지 모아보기</Text>
          </View>
          <Image source={require('../assets/home/section_1_image.png')} style={styles.cardImage}/>
        </TouchableOpacity>

        {/* 추천 서비스 카드 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionSubTitle}>김국민님의 상담 키워드를 기반으로</Text>
          <Text style={styles.sectionTitle}>맞춤 서비스를 추천해드려요</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.recommendCard}>
              <Text style={styles.badge}>추천</Text>
              <Text style={styles.recommendTitle}>전체계좌조회</Text>
              <Text style={styles.recommendDescription}>전체계좌를 조회할 수 있어요</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recommendCard}>
              <Text style={styles.badge}>추천</Text>
              <Text style={styles.recommendTitle}>이체</Text>
              <Text style={styles.recommendDescription}>간편한 송금과 이체를 관리해요</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recommendCard}>
              <Text style={styles.badge}>추천</Text>
              <Text style={styles.recommendTitle}>공과금 납부</Text>
              <Text style={styles.recommendDescription}>공과금 납부도 스마트하게 관리할 수 있어요</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recommendCard}>
              <Text style={styles.badge}>추천</Text>
              <Text style={styles.recommendTitle}>퇴직연금</Text>
              <Text style={styles.recommendDescription}>퇴직연금을 관리하고 입금/이체/ETF를 한번에 관리해요</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* My PICK 카드 */}
        <View style={styles.sectionCard}>
          <View style={styles.headerflex}>
            <View style={styles.titleFlex}>
              <Text style={[styles.sectionTitle, { marginBottom: 0, marginRight: 5}]}>My PICK</Text>
              <Text style={styles.sectionSubTitle}>내가 관심있는 키워드</Text>
            </View>
            <TouchableOpacity style={styles.iconButton} onPress={() => setTooltipVisible(!tooltipVisible)}>
              <Icon name="help-outline" size={23} color="#9E9E9E" />
            </TouchableOpacity>
          </View>

          {/* Tooltip View */}
          {tooltipVisible && (
            <View style={styles.tooltip}>
              <Text style={styles.tooltipText}>최근 상담에서 추출된 키워드입니다.</Text>
              {/* <TouchableOpacity onPress={() => setTooltipVisible(false)}>
                <Text style={styles.tooltipClose}>닫기</Text>
              </TouchableOpacity> */}
            </View>
          )}

          <View style={styles.picks}>
            <Text style={styles.pickItem}># 예금</Text>
            <Text style={styles.pickItem}># 적금</Text>
            <Text style={styles.pickItem}># 청년디딤돌대출</Text>
          </View>
        </View>

        {/* 계좌 정보 카드 */}
        <View style={styles.sectionCard}>
          <View style={styles.headerflex}>
            <View>
              <Text style={styles.accountName}>직장인우대통장-저축예금</Text>
              <Text style={styles.accountNumber}>888888-01-123456</Text>
            </View>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="more-vert" size={23} color="#9E9E9E" />
            </TouchableOpacity>
          </View>
          <Text style={styles.accountBalance}>3,000,000원</Text>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>이체</Text>
          </TouchableOpacity>
        </View>

        {/* <Button title="Go to Member" onPress={() => navigation.navigate('Member')} />
        <Button title="Go to Counsel" onPress={() => navigation.navigate('Counsel')} />
        <Button title="Go to Record" onPress={() => navigation.navigate('Record')} />
        <Button title="Go to Settings" onPress={() => navigation.navigate('Settings')} />
        <Button title="Go to Counter" onPress={() => navigation.navigate('Counter')} /> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EEF3F9',
  },
  container: {
    flex: 1,
    paddingHorizontal: 25,
  },
  contentContainer: {
    paddingBottom: 25, // 하단 탭 높이만큼 여백 추가
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
    marginLeft: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  honorific: {
    fontSize: 22,
  },
  card: {
    backgroundColor: '#E0EBF3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,

    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 }, // iOS
    shadowOpacity: 0.1, // iOS
    shadowRadius: 3, // iOS
    elevation: 2, // Android
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 12,
    color: '#495057',
    marginVertical: 5,
  },
  cardImage: {
    width: 60,
    height: 40,
    resizeMode: 'contain',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionCard: {
    backgroundColor: '#fff',
    marginVertical: 10,
    padding: 20,
    borderRadius: 15,

    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 }, // iOS
    shadowOpacity: 0.1, // iOS
    shadowRadius: 3, // iOS
    elevation: 2, // Android
  },
  sectionSubTitle: {
    fontSize: 13,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  recommendCard: {
    backgroundColor: '#EEF3F9',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    width: 120,
    height: 130,
    alignItems: 'flex-start',
  },
  badge: {
    backgroundColor: '#FFCC00',
    borderRadius: 100,
    width: 45,
    height: 25,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 5,
  },
  recommendTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 5,
    marginHorizontal: 5,
  },
  recommendDescription: {
    fontSize: 11,
    color: '#000000',
    marginHorizontal: 5,
  },
  headerflex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleFlex:{
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  picks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  pickItem: {
    color: '#333',
    padding: 5,
    paddingHorizontal: 10,
    margin: 5,
    marginHorizontal: 3,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#333',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '600',
    fontSize: 12,
    height: 30,
  },
  accountCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
  },
  accountName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  accountNumber: {
    color: '#495057',
    marginBottom: 10,
  },
  accountBalance: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  viewButton: {
    backgroundColor: '#FFCC00',
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tooltip: {
    position: 'absolute',
    top: 50, // 아이콘 바로 아래에 위치하도록 조정
    right: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  tooltipText: {
    fontSize: 13,
    color: '#333',
  },
  tooltipClose: {
    fontSize: 10,
    color: 'blue',
    marginTop: 10,
    textAlign: 'right',
  },
});

export default HomeScreen;