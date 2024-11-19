import React, { useEffect, useState } from 'react';
import { Alert, View, Text, FlatList, ActivityIndicator, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useSelector } from 'react-redux';


function RecordListScreen({ navigation }) {
  const today = new Date(); // 오늘 날짜
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // 이번 달 1일

  const [records, setRecords] = useState([]);
  const [topKeyword, setTopKeyword] = useState("");
  const [totalCounselCount, setTotalCounselCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(firstDayOfMonth); // 이번 달 1일
  const [endDate, setEndDate] = useState(today); // 오늘 날짜
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [customerName, setCustomerName] = useState(""); // 고객명 필터 상태
  const [searchText, setSearchText] = useState(""); // 검색 입력 상태

  const user = useSelector((state) => state.user.user);
  const accessToken = user?.accessToken;
  const userId = user?.userId;
  const userType = user?.userType;

  const fetchRecords = () => {
  
    setLoading(true);
  
    const endpoint = userType === "customer" ? "/customer" : "/counselor"; // 호출할 엔드포인트 결정
  
    axios
      .get(`http://10.0.2.2:8080/api/record${endpoint}`, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`, // Redux에 저장된 토큰 사용
        },
        params: {
          userId: user?.userId, // Redux에서 userId 가져오기
          startDate: `${startDate.toISOString().split("T")[0]}T00:00:00`,
          endDate: `${endDate.toISOString().split("T")[0]}T23:59:59`,
          ...(userType === "counselor" && customerName && { customerName }), // counselor일 때만 customerName 포함
        },
      })
      .then((response) => {
        console.log("userId : "+userId);
        console.log("userType : " +userType);
        if (userType === "customer") {
          setRecords(response.data.response.data.summaries);
          setTopKeyword(response.data.response.data.topKeyword);
        } else if (userType === "counselor") {
          setRecords(response.data.response.data.summaries);
          setTotalCounselCount(response.data.response.data.totalCounselCount);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching records:", error);
        setLoading(false);
      });
  };

  const handleDeleteSummary = (summaryId) => {
    Alert.alert(
      "요약 삭제",
      "정말로 삭제하시겠습니까?",
      [
        {
          text: "취소",
          onPress: () => console.log("삭제 취소됨"),
          style: "cancel",
        },
        {
          text: "확인",
          onPress: async () => {
            try {
              setLoading(true);
              const response = await axios.delete(
                `http://10.0.2.2:8080/api/record/${summaryId}`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
              );

              if (response.status === 200) {
                console.log(`요약 ID ${summaryId}가 성공적으로 삭제되었습니다.`);
                await fetchRecords();
              }
            } catch (error) {
              console.error("메모 삭제 중 오류 발생:", error);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  
  useEffect(() => {
    fetchRecords();
  }, [startDate, endDate, customerName]); // 날짜 또는 고객명 변경 시에 fetchRecords 실행

  const onStartDateChange = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const onSearch = () => {
    setCustomerName(searchText); // 검색 텍스트를 customerName 상태로 설정하여 fetchRecords 실행
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>상담 리스트</Text>

      {/* 날짜 선택 */}
      <View style={styles.dateContainer}>
        <TouchableOpacity
          style={styles.dateBox}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={styles.dateText}>{startDate.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dateBox}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={styles.dateText}>{endDate.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={onStartDateChange}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={onEndDateChange}
        />
      )}

      {/* 고객명 검색 */}
      {userType === "counselor" && (
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="고객명을 입력하세요"
            value={searchText}
            onChangeText={text => setSearchText(text)} // 검색 입력 상태 변경
            style={styles.searchInput}
            keyboardType="default"
            multiline={false}
          />
          <TouchableOpacity onPress={onSearch} style={styles.searchButton}>
            <Text>🔍</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 상담 횟수와 키워드 통계 */}
      <View style={styles.statsContainer}>
        <View style={styles.statsBox}>
          <Text style={styles.statsLabel}>상담 횟수</Text>
          <Text style={styles.statsValue}>{records.length}건</Text>
        </View>
        {userType === "customer" ? (
          <View style={styles.statsBox}>
            <Text style={styles.statsLabel}>최다 키워드</Text>
            <Text
              style={[
                styles.keywordValue,
                !topKeyword && styles.keywordValueSmall, 
              ]}
            >
              {topKeyword ? `#${topKeyword}` : "조회된 키워드가 없습니다"}
            </Text>
          </View>
        ) : (
          <View style={styles.statsBox}>
            <Text style={styles.statsLabel}>총 상담 횟수</Text>
            <Text style={styles.keywordValue}>{totalCounselCount}건</Text>
          </View>
        )}
      </View>

      {/* 상담 리스트 */}
      <FlatList
        data={records}
        keyExtractor={item => item.summaryId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recordItem}
            onPress={() => navigation.navigate('RecordDetail', { summaryId: item.summaryId })}
          >
            {userType === "counselor" && (
              <Text style={styles.recordDate}>
                {item.counselRoom.createdAt.split("T")[0]} / {item.customerName ? item.customerName : "고객 이름 없음"}
              </Text>
            )}
            {userType === "customer" && (
              <Text style={styles.recordDate}>
                {item.counselRoom.createdAt.split("T")[0]}
              </Text>
            )}
            <Text style={styles.recordTitle}>{item.summaryShort}</Text>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteSummary(item.summaryId)}
            >
              <Text style={styles.deleteButtonText}>삭제</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dateBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  searchButton: {
    padding: 10,
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statsBox: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  statsLabel: {
    fontSize: 16,
    color: "#555",
  },
  statsValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "red",
  },
  keywordValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "blue",
  },
  recordItem: {
    padding: 16,
    backgroundColor: "#F9D776",
    borderRadius: 8,
    marginBottom: 8,
  },
  recordDate: {
    fontSize: 14,
    color: "#555",
  },
  recordTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#ff4d4f",
    borderRadius: 6,
    alignSelf: "flex-end",
  },
  deleteButtonText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  keywordValueSmall: {
    paddingVertical : 6,
    fontSize: 13, // 작은 폰트 크기
    fontWeight: "normal",
    color: "blue", // 기존 색상 유지
  },
});

export default RecordListScreen;
