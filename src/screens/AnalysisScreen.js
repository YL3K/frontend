import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import MonthPicker from 'react-native-month-year-picker';
import axios from 'axios';
import AgePieChart from '../components/analysis/AgePieChart';
import KeywordList from '../components/analysis/KeywordList';
import KeywordCloud from '../components/analysis/KeywordCloud';
import ClockChart from '../components/analysis/ClockChart';
import DurationChart from '../components/analysis/DurationChart';
import CountChart from '../components/analysis/CountChart';

const generateCompleteTimeData = (data) => {
  const completeData = {};
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = ['00', '30'];

  hours.forEach((hour) => {
      minutes.forEach((minute) => {
          const time = `${hour.toString().padStart(2, '0')}:${minute}`;
          completeData[time] = data[time] || 0;
      });
  });

  return completeData;
};

// ISO 8601 형식(PTHMS)을 분 단위로 변환하는 함수
function parseDuration(isoDuration) {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = isoDuration.match(regex);

  if (!matches) return 0;

  const hours = parseInt(matches[1] || '0', 10);
  const minutes = parseInt(matches[2] || '0', 10);
  const seconds = parseInt(matches[3] || '0', 10);

  return hours * 60 + minutes + seconds / 60;
}

function AnalysisScreen() {
  // 현재 날짜를 기준으로 초기 값 설정
  const today = new Date();
  const initialEndYearMonth = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}`;
  const initialStartYearMonth = `${today.getFullYear() - 1}.${String(today.getMonth() + 1).padStart(2, '0')}`;

  const [startYearMonth, setStartYearMonth] = useState(initialStartYearMonth);
  const [endYearMonth, setEndYearMonth] = useState(initialEndYearMonth);
  const [startYearMonthCount, setStartYearMonthCount] = useState(initialStartYearMonth);
  const [endYearMonthCount, setEndYearMonthCount] = useState(initialEndYearMonth);
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);
  const [isStartCountPickerVisible, setStartCountPickerVisible] = useState(false);
  const [isEndCountPickerVisible, setEndCountPickerVisible] = useState(false);
  
  const [ageData, setAgeData] = useState([]);
  const [keywordData, setKeywordData] = useState([]);
  const [timeData, setTimeData] = useState({});
  const [durationData, setDurationData] = useState([]);
  const [countData, setCountData] = useState([]);
  const [error, setError] = useState(null);

  const fetchAgeData = useCallback(async () => {
    try {
      const response = await axios.get('http://192.168.219.108:8080/api/v1/record/analysis/age');
      const data = response.data;

      const total = Object.values(data).reduce((sum, value) => sum + value, 0) || 1;

      const formattedData = [
        { name: `% - 20세 이하`, population: (data['20세 이하'] || 0) / total * 100, color: '#FF6384', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: `% - 20대`, population: (data['20대'] || 0) / total * 100, color: '#36A2EB', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: `% - 30대`, population: (data['30대'] || 0) / total * 100, color: '#FFCE56', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: `% - 40대`, population: (data['40대'] || 0) / total * 100, color: '#4BC0C0', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: `% - 50세 이상`, population: (data['50세 이상'] || 0) / total * 100, color: '#9966FF', legendFontColor: '#7F7F7F', legendFontSize: 12 },
      ];

      setAgeData(formattedData);
    } catch (error) {
      console.error("Error fetching age data:", error);
      setError(error);
    }
  }, []);

  const fetchKeywordData = useCallback(async () => {
    try {
      const response = await axios.get('http://192.168.219.108:8080/api/v1/record/analysis/keywords');
      setKeywordData(response.data);
    } catch (error) {
      console.error("Error fetching keywords:", error);
      setError(error);
    }
  }, []);

  const fetchTimeData = useCallback(async () => {
    try {
      const response = await axios.get('http://192.168.219.108:8080/api/v1/record/analysis/time');
      const completeData = generateCompleteTimeData(response.data);
      setTimeData(completeData);
    } catch (error) {
      console.error("Error fetching time data:", error);
      setError(error);
    }
  }, []);

  const fetchDurationData = useCallback(async () => {
    try {
      const response = await axios.get(`http://192.168.219.108:8080/api/v1/record/analysis/runtime/range/${startYearMonth}/${endYearMonth}`);
      const formattedData = Object.entries(response.data).map(([yearMonth, duration]) => ({
        yearMonth,
        duration: parseDuration(duration)
      }));
      setDurationData(formattedData);
    } catch (error) {
      console.error("Error fetching duration data:", error);
    }
  }, [startYearMonth, endYearMonth]);

  const fetchCountData = useCallback(async () => {
    try {
      const response = await axios.get(`http://192.168.219.108:8080/api/v1/record/analysis/count/range/${startYearMonthCount}/${endYearMonthCount}`);
      const formattedData = Object.entries(response.data).map(([yearMonth, count]) => ({
        yearMonth,
        count,
      }));
      setCountData(formattedData);
    } catch (error) {
      console.error("Error fetching count data:", error);
    }
  }, [startYearMonthCount, endYearMonthCount]);

  useEffect(() => {
    fetchAgeData();
    fetchKeywordData();
    fetchTimeData();
    fetchDurationData();
    fetchCountData();
  }, [fetchAgeData, fetchKeywordData, fetchTimeData, fetchDurationData, fetchCountData]);

  const handleConfirmStart = (date) => {
    setStartYearMonth(`${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`);
    setStartPickerVisible(false);
  };

  const handleConfirmEnd = (date) => {
    setEndYearMonth(`${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`);
    setEndPickerVisible(false);
  };

  const handleConfirmStartCount = (date) => {
    setStartYearMonthCount(`${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`);
    setStartCountPickerVisible(false);
  };

  const handleConfirmEndCount = (date) => {
    setEndYearMonthCount(`${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`);
    setEndCountPickerVisible(false);
  };

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>고객 연령층</Text>
      {ageData.length > 0 && (
        <View style={styles.chartContainer}>
          <AgePieChart data={ageData} />
        </View>
      )}
      <Text style={styles.title}>키워드 빈도</Text>
      {keywordData.length > 0 && (
        <View style={styles.chartContainer}>
          <KeywordCloud words={keywordData} />
        </View>
      )}
      <Text style={styles.title}>키워드 랭킹</Text>
      {keywordData.length > 0 && (
        <View style={styles.chartContainer}>
          <KeywordList data={keywordData} />
        </View>
      )}
      <Text style={styles.title}>상담 발생 시각</Text>
      {Object.keys(timeData).length > 0 && (
        <View style={styles.chartContainer}>
          <ClockChart data={timeData} />
        </View>
      )}
      <Text style={styles.title}>상담 평균 시간</Text>
      <View style={styles.dateContainer}>
        <TouchableOpacity style={styles.dateButton} onPress={() => setStartPickerVisible(true)}>
          <Text style={styles.buttonText}>시작 : {startYearMonth}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateButton} onPress={() => setEndPickerVisible(true)}>
          <Text style={styles.buttonText}>종료 : {endYearMonth}</Text>
        </TouchableOpacity>
      </View>
      {durationData.length > 0 && (
        <View style={styles.chartContainer}>
          <DurationChart data={durationData} />
        </View>
      )}
      {isStartPickerVisible && (
        <MonthPicker
          onChange={(event, date) => {
            setStartPickerVisible(false);
            if (date) handleConfirmStart(date);
          }}
          value={new Date(today.getFullYear() - 1, today.getMonth())}
          maximumDate={new Date()}
          locale="ko"
          mode="monthYear"
        />
      )}
      {isEndPickerVisible && (
        <MonthPicker
          onChange={(event, date) => {
            setEndPickerVisible(false);
            if (date) handleConfirmEnd(date);
          }}
          value={new Date()}
          maximumDate={new Date()}
          locale="ko"
          mode="monthYear"
        />
      )}

<Text style={styles.title}>상담 건수</Text>
      <View style={styles.dateContainer}>
        <TouchableOpacity style={styles.dateButton} onPress={() => setStartCountPickerVisible(true)}>
          <Text style={styles.buttonText}>시작 : {startYearMonthCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateButton} onPress={() => setEndCountPickerVisible(true)}>
          <Text style={styles.buttonText}>종료 : {endYearMonthCount}</Text>
        </TouchableOpacity>
      </View>
      {countData.length > 0 && (
        <View style={styles.chartContainer}>
          <CountChart data={countData} />
        </View>
      )}

      {/* MonthPicker for countData */}
      {isStartCountPickerVisible && (
        <MonthPicker
          onChange={(event, date) => {
            setStartCountPickerVisible(false);
            if (date) handleConfirmStartCount(date);
          }}
          value={new Date(today.getFullYear() - 1, today.getMonth())}
          maximumDate={new Date()}
          locale="ko"
          mode="monthYear"
        />
      )}
      {isEndCountPickerVisible && (
        <MonthPicker
          onChange={(event, date) => {
            setEndCountPickerVisible(false);
            if (date) handleConfirmEndCount(date);
          }}
          value={new Date()}
          maximumDate={new Date()}
          locale="ko"
          mode="monthYear"
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  chartContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 15,
    marginBottom: 10,
    padding: 15,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateButton: {
    borderRadius: 8,
    padding: 10,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
  },
  searchButton: {
    backgroundColor: '#007bff',
    borderRadius: 100,
    padding: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    textAlignVertical: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default AnalysisScreen;