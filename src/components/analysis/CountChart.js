import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View, Text, StyleSheet } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const CountChart = ({ data }) => {
    const labels = data.map((item, index) => (index % 2 === 0 ? item.yearMonth.slice(5) : ''));
    const chartData = data.map(item => item.count);

    return (
        <View style={styles.container}>
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
                    },
                }}
                // bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
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
});

export default CountChart;
