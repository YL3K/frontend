import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeHeader = () => {
  return (
    <View style={styles.headerContainer}>
      {/* 알림 버튼 */}
      <TouchableOpacity style={styles.iconButton}>
        <Icon name="notifications" size={24} color="#000000" />
      </TouchableOpacity>

      {/* 상담 버튼 */}
      <TouchableOpacity style={styles.iconButton}>
        <Icon name="headset-mic" size={24} color="#000000" />
      </TouchableOpacity>

      {/* 메뉴 버튼 */}
      <TouchableOpacity style={styles.iconButton}>
        <Icon name="menu" size={24} color="#000000" />
      </TouchableOpacity>
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
  },
});

export default HomeHeader;