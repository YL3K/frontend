import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';


function LogoHeader() {
  const navigation = useNavigation();
  const route = useRoute();
  const title = route.name;

  // 특정 화면에서만 뒤로가기 버튼 숨기기
  const hideBackButtonScreens = ['Home', 'Login', 'Counsel', 'VideoConsult', 'EndSession', 'CounselorWaiting', 'CounselMain', 'CustomerMain'];
  const showBackButton = !hideBackButtonScreens.includes(title) && navigation.canGoBack();
  console.log(showBackButton);
  
  return (
    <View style={styles.headerContainer}>
      {showBackButton && (
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#000000" />
      </TouchableOpacity>
      )}
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.headerText}>KB스타후르츠뱅킹</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    headerContainer: {
      height: 60,
      flexDirection: 'row', // 가로 배치
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    backButton: {
      position: 'absolute',
      left: 10,
    },
    logo: {
      width: 40,
      height: 30,
      resizeMode: 'cover',
    },
    headerText: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#787268',
    },
  });

export default LogoHeader;
