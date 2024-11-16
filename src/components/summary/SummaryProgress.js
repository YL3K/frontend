import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LoadingDots from "react-native-loading-dots";

const SummaryProgress = () => {
  return (
    <View style={styles.container}>
      <View style={styles.dotsWrapper}>
        <LoadingDots
        colors={["#1CB1D1", "#C471ED", "#1CB1D1", "#C471ED"]}
        size={18}
        bounceHeight={10}
        />
      </View>
      <View>
          <Text style={styles.summaryText}>현재 상담 내용이</Text>
          <Text style={styles.summaryText}>요약되고 있습니다.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  dotsWrapper: {
    width: 100,
    height: 50,
  },
  summaryText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SummaryProgress;