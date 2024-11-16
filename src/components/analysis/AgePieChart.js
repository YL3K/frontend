import React from 'react';
import { Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

function AgePieChart({data}){
    return (
        <PieChart
            data={data}
            width={screenWidth - 80}
            height={220}
            chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
        />
    );
}

const styles = {
    chartContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 15,
        marginBottom: 10,
        padding: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
};

export default AgePieChart;