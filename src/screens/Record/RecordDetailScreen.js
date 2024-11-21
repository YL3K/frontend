import React, { useEffect, useState } from "react";
import { Alert, View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Linking } from "react-native";
import axios from "axios";
import { useSelector } from 'react-redux';
import ReusableTwoBtnModal from "../../components/modal/ReusableTwoBtnModal";

function RecordDetailScreen({ route,navigation }) {
  const { summaryId } = route.params || {}; 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMemoModalVisible, setIsMemoModalVisible] = useState(false);
  const [selectedMemoId, setSelectedMemoId] = useState(null);

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbackInput, setFeedbackInput] = useState("");
  const [memoInput, setMemoInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const user = useSelector((state) => state.user.user);
 
  const accessToken = user?.accessToken;
  const userType = user?.userType;
  const userId = user?.userId;
  useEffect(() => {
    if (summaryId) {
      console.log("Navigated to RecordDetail with summaryId:", summaryId); // summaryId 디버깅
      fetchRecordDetails();
    } else {
      console.error("No summaryId provided in route.params");
    }
  }, [summaryId]);

  const fetchRecordDetails = async () => {
    try {
        const response = await axios.get(`http://10.0.2.2:8080/api/record/summary`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: { summaryId },
        });

        console.log("Fetched details:", response.data);
        setDetails(response.data?.response?.data || {});
    } catch (error) {
        console.error("Error fetching record details:", error);
    } finally {
        setLoading(false); // 로딩 상태 종료
    }
};


  const handleFeedbackSubmit = async () => {
    if (!feedbackInput.trim()) {
      console.error("피드백 내용이 비어 있습니다.");
      return;
    }
    try {
      const response = await axios.post(
        `http://10.0.2.2:8080/api/record/feedback`,
        {
          summaryId,
          feedback: feedbackInput,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // 피드백 상태 직접 업데이트
        setDetails((prevDetails) => ({
          ...prevDetails,
          feedback: feedbackInput,
        }));
        setFeedbackInput(""); // 입력 필드 초기화
      }
    } catch (error) {
      console.error("피드백 추가 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };





  const handleMemoSubmit = async () => {
    if (!memoInput.trim()) {
      console.error("메모 내용이 비어 있습니다.");
      return;
    }
    try {
      const response = await axios.post(
        `http://10.0.2.2:8080/api/record/memo`,
        {
          summaryId,
          memo: memoInput,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        const newMemoId = response.data.response.data.memoId; // 추가된 메모 ID 가져오기
        console.log("추가된 메모 ID:", newMemoId);
  
        // 기존 상태에 메모 추가
        setDetails((prevDetails) => ({
          ...prevDetails,
          memos: [
            ...(prevDetails?.memos || []),
            {
              memoId: newMemoId,
              memo: memoInput,
              createdAt: response.data.response.data.createdAt,
            },
          ],
        }));
  
        // 입력 필드 초기화
        setMemoInput("");
      }
    } catch (error) {
      console.error("메모 추가 중 오류 발생:", error);
    }
  };
  

  const handleDeleteMemo = (memoId) => {
    setSelectedMemoId(memoId); // 삭제할 메모 ID 설정
    setIsMemoModalVisible(true); // 모달 표시
  };


  const confirmDeleteMemo = async () => {
    if (!selectedMemoId) return; // 삭제할 메모 ID가 없으면 종료
    try {
      const response = await axios.delete(
        `http://10.0.2.2:8080/api/record/memo/${selectedMemoId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      if (response.status === 200) {
        setDetails((prevDetails) => ({
          ...prevDetails,
          memos: prevDetails.memos.filter(
            (memo) => memo.memoId !== selectedMemoId
          ),
        }));
        setIsMemoModalVisible(false); // 모달 숨기기
        setSelectedMemoId(null); // 선택된 메모 ID 초기화
      }
    } catch (error) {
      console.error("메모 삭제 중 오류 발생:", error);
    }
  };

  const handleModifyMemo = (memoId) => {
    setDetails((prevDetails) => ({
        ...prevDetails,
        memos: prevDetails.memos.map((memo) =>
            memo.memoId === memoId
                ? { ...memo, isEditing: true, editingContent: memo.memo }
                : memo
        ),
    }));
};


  const handleSaveMemo = async (memoId, newContent) => {
    try {
      const response = await axios.patch(
        `http://10.0.2.2:8080/api/record/memo/${memoId}`,
        { memo: newContent },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // 수정된 데이터만 업데이트
        setDetails((prevDetails) => ({
          ...prevDetails,
          memos: prevDetails.memos.map((memo) =>
            memo.memoId === memoId
              ? { ...memo, memo: newContent, isEditing: false }
              : memo
          ),
        }));
      }
    } catch (error) {
      console.error("메모 수정 중 오류 발생:", error);
    }
  };





  const handleCancelEdit = (memoId) => {
    setDetails((prevDetails) => ({
        ...prevDetails,
        memos: prevDetails.memos.map((memo) =>
            memo.memoId === memoId
                ? { ...memo, isEditing: false, editingContent: undefined }
                : memo
        ),
    }));
};


const handleDeleteSummary = () => {
  setIsModalVisible(true); // 모달 표시
};

const confirmDeleteSummary = async () => {
  try {
    const response = await axios.delete(
      `http://10.0.2.2:8080/api/record/${summaryId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (response.status === 200) {
      console.log(`요약 ID ${summaryId}가 성공적으로 삭제되었습니다.`);
      navigation.goBack();
    }
  } catch (error) {
    console.error("요약 삭제 중 오류 발생:", error);
  } finally {
    setIsModalVisible(false); // 모달 숨기기
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

  if (!details) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>상세 데이터를 불러올 수 없습니다.</Text>
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
        <Text style={styles.label}>상담 날짜</Text>
        <Text style={styles.value}>
          {details?.counselDate ? details.counselDate.split("T")[0] : "날짜 없음"}
        </Text>
      </View>

      {/* 상담사 */}
      <View style={styles.row}>
        <Text style={styles.label}>상담사</Text>
        <Text style={styles.value}>{details?.counselor || "상담사 정보 없음"}</Text>
      </View>

      {/* 제목 */}
      <View style={styles.row}>
        <Text style={styles.label}>제목</Text>
        <Text style={styles.value}>
          {details?.summary?.summaryShort || "제목 정보 없음"}
        </Text>
      </View>

      <View style={styles.separator} />

      {/* 요약 */}
      <View style={styles.sectionBox}>
        <Text style={styles.label}>요약</Text>
        <Text style={styles.value}>
          {details?.summary?.summaryText || "요약 정보 없음"}
        </Text>
      </View>

      {/* 키워드 */}
      {details?.keywords?.length > 0 && (
        <View style={styles.sectionBox}>
          <Text style={styles.label}>키워드</Text>
          <View style={styles.keywordContainer}>
            {details.keywords.map((item, index) => (
              <TouchableOpacity
                key={index} // 고유 키 설정
                onPress={() => Linking.openURL(item.urls)} // URL 열기
                style={styles.keywordButton} // 터치 가능한 스타일 추가
              >
                <Text style={styles.keyword}>#{item.keyword}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    


      {/* 상담 내용 */}
      {details?.fullText && (
        <View style={styles.sectionBox}>
          <Text style={styles.label}>상담 내용</Text>
          <Text style={styles.value}>
            {details.fullText.length > 50 && !isExpanded
              ? `${details.fullText.substring(0, 50)}...`
              : details.fullText}
          </Text>
          {details.fullText.length > 50 && (
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => setIsExpanded((prev) => !prev)}
            >
              <Text style={styles.readMoreText}>
                {isExpanded ? "접기" : "더보기"}
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
            details.memos.map((memo, index) => (
              <View key={memo.memoId} style={styles.memoContainer}>
                <Text style={styles.memoDate}>{memo.createdAt.split("T")[0]}</Text>
                {memo.isEditing ? (
                  <View>
                    {/* 수정 모드: TextInput 표시 */}
                    <TextInput
                      style={styles.textInput}
                      value={memo.editingContent || memo.memo}
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
                      {/* 저장 버튼 */}
                      <TouchableOpacity
                        style={styles.modifyButton}
                        onPress={() => handleSaveMemo(memo.memoId, memo.editingContent)}
                      >
                        <Text style={styles.modifyButtonText}>저장</Text>
                      </TouchableOpacity>
                      {/* 취소 버튼 */}
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
                    {/* 일반 모드: 메모 텍스트와 수정/삭제 버튼 표시 */}
                    <Text style={styles.memoText}>{memo.memo}</Text>
                    <View style={styles.buttonContainer}>
                      {/* 수정 버튼 */}
                      <TouchableOpacity
                        style={styles.modifyButton}
                        onPress={() => handleModifyMemo(memo.memoId)}
                      >
                        <Text style={styles.modifyButtonText}>수정</Text>
                      </TouchableOpacity>
                      {/* 삭제 버튼 */}
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
            <Text style={styles.value}>등록된 메모가 없습니다.</Text>
          )}

          {/* 삭제 확인 모달 */}
          <ReusableTwoBtnModal
            isVisible={isMemoModalVisible}
            title="메모 삭제"
            content="정말로 삭제하시겠습니까?"
            onBtnText1="취소"
            onBtnAction1={() => {
              setIsMemoModalVisible(false); // 모달 숨기기
              setSelectedMemoId(null); // 선택된 메모 ID 초기화
            }}
            onBtnText2="확인"
            onBtnAction2={confirmDeleteMemo} // 삭제 확인
          />
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


      {/* 삭제 버튼 */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteSummary}
      >
        <Text style={styles.deleteButtonText}>삭제</Text>
      </TouchableOpacity>

      {/* 삭제 확인 모달 */}
      <ReusableTwoBtnModal
        isVisible={isModalVisible}
        title="요약 삭제"
        content="정말로 삭제하시겠습니까?"
        onBtnText1="취소"
        onBtnAction1={() => setIsModalVisible(false)} // 모달 닫기
        onBtnText2="확인"
        onBtnAction2={confirmDeleteSummary} // 삭제 확인
      />
  




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
  keywordButton: {
    margin: 4,
    borderRadius: 12,
    backgroundColor: "#E6E6E6",
    paddingVertical: 4,
    paddingHorizontal: 8,
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