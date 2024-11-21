import React, { useState, useEffect } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View, Text, StyleSheet } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const DurationChart = ({ data }) => {
  // 날짜 순서로 정렬
  const sortedData = data.sort((a, b) => new Date(a.yearMonth) - new Date(b.yearMonth));

  // 최대 12개의 라벨만 표시되도록 간격 조정
  const maxLabels = 15;
  const step = Math.ceil(sortedData.length / maxLabels); // 라벨을 건너뛰는 간격 계산
  const labels = sortedData.map((item, index) =>
    index % step === 0 ? item.yearMonth.slice(5) : ''
  );

  const chartData = sortedData.map(item => item.duration);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    if (selectedData) {
      const timeout = setTimeout(() => setSelectedData(null), 2000);
      return () => clearTimeout(timeout);
    }
  }, [selectedData]);

  return (
    <View style={styles.container}>
      {selectedData && (
        <View
          style={[
            styles.tooltip,
            { top: selectedData.y - 30, left: selectedData.x - 20 }
          ]}
        >
          <Text style={styles.tooltipText}>
              {selectedData.label}: {selectedData.value.toFixed(1)}분
          </Text>
        </View>
      )}
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: chartData,
            },
          ],
        }}
        width={screenWidth - 60} // 화면 너비에 맞추기
        height={220}
        yAxisSuffix="분"
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '3',
            strokeWidth: '2',
            stroke: '#007bff',
          },
        }}
        // bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        onDataPointClick={({ index, value, x, y }) => {
          setSelectedData({
            label: sortedData[index].yearMonth.slice(2).replace('-', '.'),
            value: value,
            x: x + 16,
            y: y + 8,
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: screenWidth - 55, // 전체 컨테이너 너비 조정
    alignSelf: 'center',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 5,
    borderRadius: 5,
    zIndex: 999,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default DurationChart;
