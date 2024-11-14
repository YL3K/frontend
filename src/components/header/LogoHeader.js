import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

function LogoHeader() {
  return (
    <View style={styles.headerContainer}>
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
    //   borderBottomWidth: 1,
    //   borderBottomColor: '#ddd',
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
