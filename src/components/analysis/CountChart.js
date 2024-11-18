import React, { useState, useEffect } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View, Text, StyleSheet } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const CountChart = ({ data }) => {
  const labels = data.map((item, index) => (index % 2 === 0 ? item.yearMonth.slice(5) : ''));
  const chartData = data.map(item => item.count);
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
            {selectedData.label}: {selectedData.value}건
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
        width={screenWidth - 60}
        height={220}
        yAxisSuffix="건"
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 127, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#FF7F00',
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        onDataPointClick={({ index, value, x, y }) => {
          setSelectedData({
            label: data[index].yearMonth.slice(2).replace('-', '.'),
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
    width: screenWidth - 55,
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

export default CountChart;
