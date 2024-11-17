import React, { useEffect, useState } from "react";
import { Alert, View, Text, ScrollView, ActivityIndicator, StyleSheet,TouchableOpacity, TextInput  } from "react-native";
import axios from "axios";

function RecordDetailScreen({ route }) {
  const { summaryId } = route.params; 
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbackInput, setFeedbackInput] = useState("");
  const [memoInput, setMemoInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const userType = "customer"; // customer,counselor, 임의로 상담사로 설정. 실제로는 쿠키/세션/로컬 스토리지에서 가져와야 함.
  const userId = 3; // 예제용 고정 userId 값

  useEffect(() => {
    if (!details) {
      fetchRecordDetails();
    }
  }, [summaryId]);

  const fetchRecordDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://10.0.2.2:8080/api/record/summary`, {
        params: { summaryId },
      });
      setDetails(response.data);
    } catch (error) {
      console.error("Error fetching record details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMemo = (memoId) => {
    Alert.alert(
      "메모 삭제",
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
              setLoading(true); // 로딩 상태 시작
              const response = await axios.delete(
                `http://10.0.2.2:8080/api/record/memo/${memoId}`,
                { headers: { "Content-Type": "application/json" } }
              );
  
              if (response.status === 200) {
                console.log(`메모 ID ${memoId}가 성공적으로 삭제되었습니다.`);
                await fetchRecordDetails(); // 데이터 다시 로드
              }
            } catch (error) {
              console.error("메모 삭제 중 오류 발생:", error);
            } finally {
              setLoading(false); // 로딩 상태 종료
            }
          },
        },
      ],
      { cancelable: true } // Alert 창 외부 탭으로 닫기 가능
    );
  };

  const handleModifyMemo = (memoId) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      memos: prevDetails.memos.map((memo) =>
        memo.memoId === memoId
          ? { ...memo, isEditing: true } // 수정 상태로 변경
          : memo
      ),
    }));
  };
  
  const handleSaveMemo = async (memoId, newContent) => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `http://10.0.2.2:8080/api/record/memo/${memoId}`,
        { memo: newContent },
        { headers: { "Content-Type": "application/json" } }
      );
  
      if (response.status === 200) {
        console.log(`메모 ID ${memoId}가 성공적으로 수정되었습니다.`);
        await fetchRecordDetails(); // 데이터 다시 로드
      }
    } catch (error) {
      console.error("메모 수정 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelEdit = (memoId) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      memos: prevDetails.memos.map((memo) =>
        memo.memoId === memoId
          ? { ...memo, isEditing: false } // 수정 상태 취소
          : memo
      ),
    }));
  };
  

  const handleFeedbackSubmit = async () => {
    if (!feedbackInput.trim()) {
      console.error("피드백 내용이 비어 있습니다.");
      return;
    }
  
    try {
      setLoading(true); // 로딩 상태 시작
      const response = await axios.post(
        `http://10.0.2.2:8080/api/record/feedback`,
        {
          summaryId, 
          feedback: feedbackInput,
        },
        { headers: { "Content-Type": "application/json" } }
      );
  
      if (response.status === 200) {
        console.log("피드백이 성공적으로 저장되었습니다.");
        setFeedbackInput(""); // 입력 필드 초기화
        await fetchRecordDetails(); // 화면 갱신을 위해 데이터 다시 로드
      }
    } catch (error) {
      console.error("피드백 저장 중 오류 발생:", error);
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  const handleMemoSubmit = async () => {
    if (!memoInput.trim()) {
      console.error("메모 내용이 비어 있습니다.");
      return;
    }
  
    try {
      setLoading(true); // 로딩 상태 시작
      const response = await axios.post(
        `http://10.0.2.2:8080/api/record/memo`,
        {
          summaryId,
          userId, 
          memo: memoInput,
        },
        { headers: { "Content-Type": "application/json" } }
      );
  
      if (response.status === 200) {
        console.log("피드백이 성공적으로 저장되었습니다.");
        setMemoInput(""); // 입력 필드 초기화
        await fetchRecordDetails(); // 화면 갱신을 위해 데이터 다시 로드
      }
    } catch (error) {
      console.error("피드백 저장 중 오류 발생:", error);
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };



  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>데이터를 불러오는 중입니다...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* 상담 날짜 */}
      <View style={styles.row}>
        <Text style={styles.label}>상담 날짜 </Text>
        <Text style={styles.value}>{details.counselDate.split("T")[0]}</Text>
      </View>

      {/* 상담사 */}
      <View style={styles.row}>
        <Text style={styles.label}>상담사 </Text>
        <Text style={styles.value}>{details.counselor}</Text>
      </View>

      {/* 제목 */}
      <View style={styles.row}>
        <Text style={styles.label}>제목 </Text>
        <Text style={styles.value}>{details.summary.summaryShort}</Text>
      </View>

      <View style={styles.separator} />

      {/* 요약 */}
      <View style={styles.sectionBox}>
        <Text style={styles.label}>요약</Text>
        <Text style={styles.value}>{details.summary.summaryText}</Text>
      </View>

      {/* 키워드 */}
      {details.keywords && details.keywords.length > 0 && (
        <View style={styles.sectionBox}>
          <Text style={styles.label}>키워드</Text>
          <View style={styles.keywordContainer}>
            {details.keywords.map((keyword, index) => (
              <Text key={index} style={styles.keyword}>
                #{keyword}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* 상담 내용 */}
      {details.fullText && (
        <View style={styles.sectionBox}>
          <Text style={styles.label}>상담 내용</Text>
          <Text style={styles.value}>
            {details.fullText.length > 50 && !isExpanded // 텍스트 길이 100 이상일 때만 자르기
              ? `${details.fullText.substring(0, 50)}...`
              : details.fullText}
          </Text>
          {details.fullText.length > 50 && (
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => setIsExpanded((prevState) => !prevState)}
            >
              <Text style={styles.readMoreText}>
                {isExpanded ? '접기' : '더보기'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}


      {/* 상담 피드백 */}
      {(userType === "counselor" || (details.feedback && details.feedback.length > 0)) && (
        <View style={styles.sectionBox}>
          <Text style={styles.label}>상담 피드백</Text>
          {details.feedback && details.feedback.length > 0 ? (
            // 피드백이 있는 경우
            <Text style={styles.value}>{details.feedback}</Text>
          ) : (
            // 피드백이 없는 경우 상담사에게만 등록 버튼 표시
            userType === "counselor" && (
              <View>
                <TextInput
                  style={styles.textInput}
                  placeholder="상담 피드백을 입력하세요."
                  value={feedbackInput}
                  onChangeText={setFeedbackInput}
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleFeedbackSubmit}
                  >
                    <Text style={styles.addButtonText}>등록</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          )}
        </View>
      )}


      <View style={styles.separator} />

      {/* 메모 */}
      {userType === "customer" && (
        <View>
          {/* "메모" 제목 항상 표시 */}
          <Text style={styles.label}>메모</Text>
          {/* 메모 목록 */}
          {details.memos && details.memos.length > 0 ? (
            details.memos.map((memo) => (
              <View key={memo.memoId} style={styles.memoContainer}>
                <Text style={styles.memoDate}>{memo.createdAt.split("T")[0]}</Text>
                {memo.isEditing ? (
                  <View>
                    <TextInput
                      style={[
                        styles.textInput,
                        { backgroundColor: "#F9D776" },
                      ]}
                      value={
                        memo.hasOwnProperty("editingContent")
                          ? memo.editingContent
                          : memo.memo
                      }
                      onChangeText={(text) =>
                        setDetails((prevDetails) => ({
                          ...prevDetails,
                          memos: prevDetails.memos.map((m) =>
                            m.memoId === memo.memoId
                              ? { ...m, editingContent: text }
                              : m
                          ),
                        }))
                      }
                    />
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.modifyButton}
                        onPress={() => {
                          const contentToSave = memo.hasOwnProperty(
                            "editingContent"
                          )
                            ? memo.editingContent
                            : memo.memo;

                          handleSaveMemo(memo.memoId, contentToSave);
                        }}
                      >
                        <Text style={styles.modifyButtonText}>저장</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleCancelEdit(memo.memoId)}
                      >
                        <Text style={styles.deleteButtonText}>취소</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View>
                    <Text style={styles.memoText}>{memo.memo}</Text>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.modifyButton}
                        onPress={() => handleModifyMemo(memo.memoId)}
                      >
                        <Text style={styles.modifyButtonText}>수정</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteMemo(memo.memoId)}
                      >
                        <Text style={styles.deleteButtonText}>삭제</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))
          ) : (
            // 메모가 없는 경우
            <Text style={styles.value}>등록된 메모가 없습니다.</Text>
          )}
        </View>
      )}

      {userType === "customer" && (
        <View style={styles.memoInputBox}>
          <View>
            <TextInput
              style={styles.textInput}
              placeholder="추가할 메모를 입력하세요."
              value={memoInput}
              onChangeText={setMemoInput}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleMemoSubmit}
              >
                <Text style={styles.addButtonText}>등록</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      

     



      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  sectionBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8, 
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: "#555",
    flex: 2,
    textAlign: "left",
  },
  keywordContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  keyword: {
    backgroundColor: "#E6E6E6",
    paddingVertical: 4,
    paddingHorizontal: 8,
    margin: 4,
    borderRadius: 12,
    fontSize: 14,
    color: "#333",
  },
  memoContainer: {
    backgroundColor: "#F9D776",
    padding: 10,
    marginTop: 8,
    borderRadius: 8,
  },
  memoInputBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: "row", // 버튼을 가로로 배치
    justifyContent: "flex-end", // 우측 정렬
    marginTop: 8, // 버튼과 메모 내용 사이 간격
  },
  modifyButton: {
    marginRight: 8, // 수정 버튼과 삭제 버튼 사이 간격
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#fff", // 배경색 흰색
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  modifyButtonText: {
    fontSize: 14,
    color: "#333", // 텍스트 색상
    fontWeight: "bold",
    textAlign: "center",
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#ff4d4f", // 빨간 배경색
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 14,
    color: "#fff", // 텍스트 색상 흰색
    fontWeight: "bold",
    textAlign: "center",
  },
  textInput: {
 
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
    borderColor: "#ddd", 
  },
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#F9D776", // 녹색 버튼
    borderRadius: 20,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  readMoreButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20, // 둥근 테두리
    borderWidth: 1,
    alignItems: "center", // 텍스트 가운데 정렬
    justifyContent: "center", // 텍스트 세로 정렬
    alignSelf: "center", // 버튼 자체를 중앙 정렬
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default RecordDetailScreen;
