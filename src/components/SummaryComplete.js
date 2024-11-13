import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'

const SummaryProgress = () => {
  return (
    <View style={styles.container}>
      <View style={styles.dotsWrapper}>
        <Icon name="check-circle" size={40}></Icon>
      </View>
      <View>
          <Text style={styles.summaryText}>상담 요약이</Text>
          <Text style={styles.summaryText}>완료되었습니다.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  dotsWrapper: {
    height: 50,
  },
  summaryText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SummaryProgress;