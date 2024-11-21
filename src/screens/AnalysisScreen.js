import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import MonthPicker from 'react-native-month-year-picker';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';
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

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function AnalysisScreen() {
  const user = useSelector((state) => state.user.user);
  const accessToken = user?.accessToken;

  // 현재 날짜를 기준으로 초기 값 설정
  const today = new Date();
  const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1));
  const initialEndYearMonth = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}`;
  const initialStartYearMonth = `${today.getFullYear() - 1}.${String(today.getMonth() + 1).padStart(2, '0')}`;
  

  // 나이 영역 날짜 초기 값 설정
  const [startDateAge, setStartDateAge] = useState(oneMonthAgo);
  const [endDateAge, setEndDateAge] = useState(today);
  const [isStartPickerVisibleAge, setStartPickerVisibleAge] = useState(false);
  const [isEndPickerVisibleAge, setEndPickerVisibleAge] = useState(false);
  const [selectedAgeOption, setSelectedAgeOption] = useState('전체');

  // 키워드 초기 값 설정
  const [startDateKeyword, setStartDateKeyword] = useState(oneMonthAgo);
  const [endDateKeyword, setEndDateKeyword] = useState(today);
  const [isStartPickerVisibleKeyword, setStartPickerVisibleKeyword] = useState(false);
  const [isEndPickerVisibleKeyword, setEndPickerVisibleKeyword] = useState(false);
  const [selectedKeywordOption, setSelectedKeywordOption] = useState('전체');
  const [isCloud, setCloud] = useState(false);

  // 상담 요청 시간 초기 값 설정
  const [startDateTime, setStartDateTime] = useState(oneMonthAgo);
  const [endDateTime, setEndDateTime] = useState(today);
  const [isStartPickerVisibleTime, setStartPickerVisibleTime] = useState(false);
  const [isEndPickerVisibleTime, setEndPickerVisibleTime] = useState(false);
  const [selectedTimeOption, setSelectedTimeOption] = useState('전체');

  //월별 평균상담시간 날짜 초기 값 설정
  const [startYearMonth, setStartYearMonth] = useState(initialStartYearMonth);
  const [endYearMonth, setEndYearMonth] = useState(initialEndYearMonth);
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  //월별 상담 건수 날짜 초기 값 설정
  const [startYearMonthCount, setStartYearMonthCount] = useState(initialStartYearMonth);
  const [endYearMonthCount, setEndYearMonthCount] = useState(initialEndYearMonth);
  const [isStartCountPickerVisible, setStartCountPickerVisible] = useState(false);
  const [isEndCountPickerVisible, setEndCountPickerVisible] = useState(false);
  
  //각 데이터 값 설정
  const [ageData, setAgeData] = useState([]);
  const [keywordData, setKeywordData] = useState([]);
  const [timeData, setTimeData] = useState({});
  const [durationData, setDurationData] = useState([]);
  const [countData, setCountData] = useState([]);

  //각 데이터 로딩 값 설정
  const [isAgeLoading, setIsAgeLoading] = useState(true);
  const [isKeywordLoading, setIsKeywordLoading] = useState(true);
  const [isTimeLoading, setIsTimeLoading] = useState(true);
  const [isDurationLoading, setIsDurationLoading] = useState(true);
  const [isCountLoading, setIsCountLoading] = useState(true);

  //에러 상태
  const [error, setError] = useState(null);

  //연령 데이터 Fetch
  const fetchAgeData = useCallback(async () => {
    setIsAgeLoading(true);
    try {
      let response;
      if (selectedAgeOption === '전체') {
        response = await axios.get('http://10.0.2.2:8080/api/v1/record/analysis/age', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      } else if ( selectedAgeOption === '날짜') {
        response = await axios.get(`http://10.0.2.2:8080/api/v1/record/analysis/age/range/${formatDate(startDateAge)}/${formatDate(endDateAge)}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      }
      
      const data = response.data;

      const total = Object.values(data).reduce((sum, value) => sum + value, 0) || 1;

      const formattedData = [
        { name: `% - 20세 미만`, population: parseFloat(((data['20세 미만'] || 0) / total * 100).toFixed(1)), color: '#FF6384', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: `% - 20대`, population: parseFloat(((data['20대'] || 0) / total * 100).toFixed(1)), color: '#36A2EB', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: `% - 30대`, population: parseFloat(((data['30대'] || 0) / total * 100).toFixed(1)), color: '#FFCE56', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: `% - 40대`, population: parseFloat(((data['40대'] || 0) / total * 100).toFixed(1)), color: '#4BC0C0', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        { name: `% - 50세 이상`, population: parseFloat(((data['50세 이상'] || 0) / total * 100).toFixed(1)), color: '#9966FF', legendFontColor: '#7F7F7F', legendFontSize: 12 },
      ];

      setAgeData(formattedData);
    } catch (error) {
      console.error("Error fetching age data:", error.message);
      setError(error);
    } finally {
      setIsAgeLoading(false);
    }
  }, [accessToken, selectedAgeOption, startDateAge, endDateAge]);

  //키워드 데이터 Fetch
  const fetchKeywordData = useCallback(async () => {
    setIsKeywordLoading(true);
    try {
      let response;
      if (selectedKeywordOption === '전체') {
        response = await axios.get('http://10.0.2.2:8080/api/v1/record/analysis/keywords', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      } else if ( selectedKeywordOption === '날짜') {
        response = await axios.get(`http://10.0.2.2:8080/api/v1/record/analysis/keywords/range/${formatDate(startDateKeyword)}/${formatDate(endDateKeyword)}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      }
      
      setKeywordData(response.data);
    } catch (error) {
      console.error("Error fetching keyword data:", error.message);
      setError(error);
    } finally {
      setIsKeywordLoading(false);
    }
  }, [accessToken, selectedKeywordOption, startDateKeyword, endDateKeyword]);

  //상담 발생 시각 데이터 Fetch
  const fetchTimeData = useCallback(async () => {
    setIsTimeLoading(true);
    try {
      let response;
      if (selectedTimeOption === '전체') {
        response = await axios.get('http://10.0.2.2:8080/api/v1/record/analysis/time', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      } else if ( selectedTimeOption === '날짜') {
        response = await axios.get(`http://10.0.2.2:8080/api/v1/record/analysis/time/range/${formatDate(startDateTime)}/${formatDate(endDateTime)}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      }
      
      const completeData = generateCompleteTimeData(response.data);
      setTimeData(completeData);
    } catch (error) {
      console.error("Error fetching time data:", error.message);
      setError(error);
    } finally {
      setIsTimeLoading(false);
    }
  }, [accessToken, selectedTimeOption, startDateTime, endDateTime]);

  //상담 평균 진행 시간 데이터 Fetch
  const fetchDurationData = useCallback(
    async (start = startYearMonth, end = endYearMonth) => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8080/api/v1/record/analysis/runtime/range/${start}/${end}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      const formattedData = Object.entries(response.data).map(([yearMonth, duration]) => ({
        yearMonth,
        duration: parseDuration(duration),
      }));
      setDurationData(formattedData);
    } catch (error) {
      console.error("Error fetching duration data:", error.message);
    } finally {
      setIsDurationLoading(false);
    }
  }, [accessToken, startYearMonth, endYearMonth]); // 의존성 배열

  //상담 월별 건수 데이터 Fetch
  const fetchCountData = useCallback(
    async (start = startYearMonthCount, end = endYearMonthCount) => {
      try {
        const response = await axios.get(`http://10.0.2.2:8080/api/v1/record/analysis/count/range/${start}/${end}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
        });
        const formattedData = Object.entries(response.data).map(([yearMonth, count]) => ({
          yearMonth,
          count,
        }));
        setCountData(formattedData);
      } catch (error) {
        console.error("Error fetching count data:", error.message);
      } finally {
        setIsCountLoading(false);
      }
    },[accessToken, startYearMonthCount, endYearMonthCount]
  );

  // useEffect(() => {
  //   fetchAgeData();
  //   fetchKeywordData();
  //   fetchTimeData();
  //   fetchDurationData();
  //   fetchCountData();
  // }, [fetchAgeData, fetchKeywordData, fetchTimeData, fetchDurationData, fetchCountData]);

  useEffect(() => {
    fetchAgeData();
  }, [fetchAgeData]);

  useEffect(() => {
    fetchKeywordData();
  }, [fetchKeywordData, isCloud]);

  useEffect(() => {
    fetchTimeData();
  }, [fetchTimeData]);

  useEffect(() => {
    fetchDurationData();
  }, [fetchDurationData]);

  useEffect(() => {
    fetchCountData();
  }, [fetchCountData]);

  //상담 평균 시간 날짜 변경 핸들러
  const handleConfirmStart = (date) => {
    const newStartYearMonth = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
    setStartYearMonth(newStartYearMonth);
    setIsDurationLoading(true);
    fetchDurationData(newStartYearMonth, endYearMonth);
  };
  
  const handleConfirmEnd = (date) => {
    const newEndYearMonth = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
    setEndYearMonth(newEndYearMonth);
    setIsDurationLoading(true);
    fetchDurationData(startYearMonth, newEndYearMonth);
  };
  
  // 상담 건수 날짜 변경 핸들러
  const handleConfirmStartCount = (date) => {
    const newStartYearMonthCount = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
    setStartYearMonthCount(newStartYearMonthCount);
    setIsCountLoading(true);
    fetchCountData(newStartYearMonthCount, endYearMonthCount);
  };

  const handleConfirmEndCount = (date) => {
    const newEndYearMonthCount = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
    setEndYearMonthCount(newEndYearMonthCount);
    setIsCountLoading(true);
    fetchCountData(startYearMonthCount, newEndYearMonthCount);
  };
  

  if (error) {
    return <Text style={styles.errorText}>{JSON.stringify(error, null, 2)}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* 고객 연령층 Section */}
      <Text style={styles.title}>고객 연령층</Text>
      <Text style={styles.description}>화상 상담을 이용한 고객님의 연령대를 나타내는 데이터입니다</Text>
      <View style={styles.chartContainer}>
        <View style={styles.radioContainer}>
          <TouchableOpacity 
            style={styles.radioOption} 
            onPress={() => setSelectedAgeOption('전체')}>
            <Text style={[
              styles.radioCircle, 
              selectedAgeOption === '전체' && styles.selectedCircle
            ]}>전체</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.radioOption} 
            onPress={() => setSelectedAgeOption('날짜')}>
            <Text style={[
              styles.radioCircle, 
              selectedAgeOption === '날짜' && styles.selectedCircle
            ]}>날짜</Text>
          </TouchableOpacity>
        </View>
        
        {selectedAgeOption === '날짜' && (
          <View style={styles.dateContainer}>
            {/* 시작 날짜 선택 */}
            <TouchableOpacity style={styles.dateButton} onPress={() => setStartPickerVisibleAge(true)}>
              <Text>시작: {formatDate(startDateAge)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateButton} onPress={() => setEndPickerVisibleAge(true)}>
              <Text>종료: {formatDate(endDateAge)}</Text>
            </TouchableOpacity>

            {isStartPickerVisibleAge && (
              <DateTimePicker
                value={startDateAge}
                mode="date"
                display="calendar"
                onChange={(event, selectedDate) => {
                  setStartPickerVisibleAge(false);
                  if (selectedDate) setStartDateAge(selectedDate);
                }}
                maximumDate={endDateAge}
              />
            )}

            {isEndPickerVisibleAge && (
              <DateTimePicker
                value={endDateAge}
                mode="date"
                display="calendar"
                onChange={(event, selectedDate) => {
                  setEndPickerVisibleAge(false);
                  if (selectedDate) setEndDateAge(selectedDate);
                }}
                minimumDate={startDateAge}
                maximumDate={new Date()}
              />
            )}
          </View>
        )}
        {/* 고객 연령층 차트 */}
        {isAgeLoading ? (
          <ActivityIndicator size="small" color="#007bff" style={{ marginVertical: 20 }} />
        ) : (
          ageData.length > 0 ? (
              <AgePieChart data={ageData} />
          ) : (
            <Text style={{ textAlign: 'center' }}>데이터가 없습니다.</Text>
          )
        )}
      </View>
      

      {/* 키워드 빈도 Section */}
      <Text style={styles.title}>키워드 빈도</Text>
      <Text style={styles.description}>화상 상담에서 가장 많이 조회된 키워드입니다</Text>
      <View style={styles.chartStyle}>
        <TouchableOpacity
          style={styles.chartStyleButton}
          onPress={()=>setCloud(false)}>
          <Text
            style={[
              styles.styleButton,
              !isCloud && styles.selectStyleButton
            ]}>랭킹</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chartStyleButton}
          onPress={()=>setCloud(true)}>
          <Text
            style={[
              styles.styleButton,
              isCloud && styles.selectStyleButton
            ]}>단어</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.chartContainer}>
        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={styles.radioOption}
            onPress={()=>setSelectedKeywordOption('전체')}>
            <Text style={[
              styles.radioCircle,
              selectedKeywordOption === '전체' && styles.selectedCircle
            ]}>전체</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setSelectedKeywordOption('날짜')}>
            <Text style={[
              styles.radioCircle,
              selectedKeywordOption === '날짜' && styles.selectedCircle
            ]}>날짜</Text>
          </TouchableOpacity>
        </View>
        
        {selectedKeywordOption === '날짜' && (
          <View style={styles.dateContainer}>
            <TouchableOpacity style={styles.dateButton} onPress={() => setStartPickerVisibleKeyword(true)}>
              <Text>시작: {formatDate(startDateKeyword)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateButton} onPress={() => setEndPickerVisibleKeyword(true)}>
              <Text>종류: {formatDate(endDateKeyword)}</Text>
            </TouchableOpacity>

            {isStartPickerVisibleKeyword && (
              <DateTimePicker
                value={startDateKeyword}
                mode="date"
                display="calendar"
                onChange={(event, selectedDate)=>{
                  setStartPickerVisibleKeyword(false);
                  if(selectedDate) setStartDateKeyword(selectedDate);
                }}
                maximumDate={endDateAge}
              />
            )}

            {isEndPickerVisibleKeyword && (
              <DateTimePicker
                value={endDateKeyword}
                mode="date"
                display="calendar"
                onChange={(event, selectedDate)=>{
                  setEndPickerVisibleKeyword(false);
                  if(selectedDate) setEndDateKeyword(selectedDate);
                }}
                minimumDate={startDateKeyword}
                maximumDate={new Date()}
              />
            )}
          </View>
        )}
        {/* 고객 키워드 차트 */}
        {isKeywordLoading ? (
          <ActivityIndicator size="small" color="#007bff" style={{ marginVertical: 20 }}/>
        ) : (
          keywordData.length > 0 ? (
            isCloud ? (
              <KeywordCloud key={isCloud} words={keywordData} />
            ) : (
              <KeywordList data={keywordData} />
            )
          ) : (
            <Text style={{ textAlign: 'center' }}>데이터가 없습니다.</Text>
          )
        )}
      </View>

      {/* 상담 발생 시각 차트 */}
      <Text style={styles.title}>상담 발생 시각</Text>
      <Text style={styles.description}>화상 상담 요청이 많은 시간대를 나타낸 차트입니다</Text>
      <View style={styles.chartContainer}>
        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setSelectedTimeOption('전체')}>
            <Text style={[
              styles.radioCircle,
              selectedTimeOption === '전체' && styles.selectedCircle
            ]}>전체</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setSelectedTimeOption('날짜')}>
            <Text style={[
              styles.radioCircle,
              selectedTimeOption === '날짜' && styles.selectedCircle
            ]}>날짜</Text>
          </TouchableOpacity>
        </View>

        {selectedTimeOption === '날짜' && (
          <View style={styles.dateContainer}>
            <TouchableOpacity style={styles.dateButton} onPress={() => setStartPickerVisibleTime(true)}>
              <Text>시작: {formatDate(startDateTime)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateButton} onPress={() => setEndPickerVisibleTime(true)}>
              <Text>종료: {formatDate(endDateTime)}</Text>
            </TouchableOpacity>

            {isStartPickerVisibleTime && (
              <DateTimePicker
                value={startDateTime}
                mode="date"
                display="calendar"
                onChange={(event, selectedDate) => {
                  setStartPickerVisibleTime(false);
                  if (selectedDate) setStartDateTime(selectedDate);
                }}
                maximumDate={endDateTime}
                />
            )}

            {isEndPickerVisibleTime && (
              <DateTimePicker
                value={endDateTime}
                mode="date"
                display="calendar"
                onChange={(event, selectedDate)=> {
                  setEndPickerVisibleTime(false);
                  if (selectedDate) setEndDateTime(selectedDate);
                }}
                minimumDate={startDateTime}
                maximumDate={new Date()}
              />
            )}
          </View>
        )}
        {/* 상담 요청 시각 차트 */}
        {isTimeLoading ? (
          <ActivityIndicator size="small" color="#007bff" style={{ marginVertical: 20 }}/>
        ) : (
          Object.keys(timeData).length > 0 ? (
              <ClockChart data={timeData} />
          ) : (
            <Text style={{ textAlign: 'center' }}>데이터가 없습니다.</Text>
          )
        )}
      </View>

      {/* 상담 평균 진행 시간 차트 */}
      <Text style={styles.title}>상담 평균 시간</Text>
      <Text style={styles.description}>월별 화상 상담 이용자들의 상담 평균 진행 시간입니다</Text>
      <View style={styles.dateContainer}>
        <TouchableOpacity style={styles.dateButton} onPress={() => setStartPickerVisible(true)}>
          <Text style={styles.buttonText}>시작 : {startYearMonth}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateButton} onPress={() => setEndPickerVisible(true)}>
          <Text style={styles.buttonText}>종료 : {endYearMonth}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.chartContainer}>
        {isDurationLoading ? (
          <ActivityIndicator size="small" color="#007bff" style={{ marginVertical: 20 }}/>
        ) : (
          durationData.length > 0 ? (
              <DurationChart data={durationData} />
          ) : (
            <Text style={{ textAlign: 'center' }}>데이터가 없습니다.</Text>
          )
        )}
      </View>
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

      {/* 월별 상담 건수 데이터 */}
      <Text style={styles.title}>상담 건수</Text>
      <Text style={styles.description}>월별 상담 진행 건수를 나타낸 차트입니다</Text>
      <View style={styles.dateContainer}>
        <TouchableOpacity style={styles.dateButton} onPress={() => setStartCountPickerVisible(true)}>
          <Text style={styles.buttonText}>시작 : {startYearMonthCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateButton} onPress={() => setEndCountPickerVisible(true)}>
          <Text style={styles.buttonText}>종료 : {endYearMonthCount}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.chartContainer}>
        {isCountLoading ? (
          <ActivityIndicator size="small" color="#007bff" style={{ marginVertical: 20 }}/>
        ) : (
          countData.length > 0 ? (
              <CountChart data={countData} />
          ) : (
            <Text style={{ textAlign: 'center' }}>데이터가 없습니다.</Text>
          )
        )}
      </View>

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
    marginTop: 30,
    marginHorizontal: 5,
  },
  description: {
    fontSize: 14,
    marginVertical: 15,
    marginHorizontal: 5,
  },
  loaderContainer: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  chartContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 15,
    marginBottom: 10,
    padding: 15,
  },
  radioContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
  },
  radioOption: {
    flex: 1,
    marginHorizontal: 5,
  },
  radioCircle: {
    borderRadius: 8,
    backgroundColor: '#CED4DA',
    textAlign: 'center',
    fontWeight: '800',
    height: 40,
    textAlignVertical: 'center',
  },
  selectedCircle: {
    borderRadius: 8,
    backgroundColor: '#FFCC00',
    textAlign: 'center',
    fontWeight: '800',
    height: 40,
    textAlignVertical: 'center',
    fontSize: 13,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  dateButton: {
    borderRadius: 8,
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
  },
  chartStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  chartStyleButton: {
    marginHorizontal: 5,
    marginBottom: 10,
    width: 50,
  },
  styleButton: {
    borderRadius: 10,
    backgroundColor: '#CED4DA',
    textAlign: 'center',
    fontWeight: '600',
    height: 25,
    textAlignVertical: 'center',
    fontSize: 12,
  },
  selectStyleButton: {
    borderRadius: 10,
    backgroundColor: '#FFCC00',
    textAlign: 'center',
    fontWeight: '600',
    height: 25,
    textAlignVertical: 'center',
    fontSize: 12,
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