import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';

const RecordBottomModal = ({ isVisible, onClose }) => {
  const user = useSelector((state) => state.user.user);
  const today = new Date();

  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [details, setDetails] = useState(null);
  const startDate = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
  const endDate = today;

  const fetchRecordsForCustomer = async () => {
    await axios.get(`http://10.0.2.2:8080/api/record/customer`, {
      params: {
        userId: user.userId,
        startDate: `${startDate.toISOString().split('T')[0]}T00:00:00`,
        endDate: `${endDate.toISOString().split('T')[0]}T23:59:59`,
      },
      headers: {
        'Authorization': 'Bearer ' + user.accessToken
      }
    })
    .then(response => {
      setRecords(response.data.response.data.summaries);
    })
    .catch(error => {
      console.error("Error fetching records:", error);
    });
  };

  const fetchRecordsForCounselor = async () => {
    await axios.get(`http://10.0.2.2:8080/api/record/counselor`, {
      params: {
        userId: user.userId,
        startDate: `${startDate.toISOString().split('T')[0]}T00:00:00`,
        endDate: `${endDate.toISOString().split('T')[0]}T23:59:59`,
      },
      headers: {
        'Authorization': 'Bearer ' + user.accessToken
      }
    })
    .then(response => {
      setRecords(response.data.summaries);
      console.log(response.data);
    })
    .catch(error => {
      console.error("Error fetching records:", error);
    });
  };

  useEffect(() => {
    if (user.userType == 'customer') {
      fetchRecordsForCustomer();
    } else {
      fetchRecordsForCounselor();
    }
  }, []);

  const handleRecordClick = async (item) => {
    setSelectedRecord(item);
    const response = await axios.get(`http://10.0.2.2:8080/api/record/summary`, {
      params: { summaryId: item.summaryId },
      headers: {
        'Authorization': "Bearer " + user.accessToken
      }
    });
    console.log(response.data.response.data);
    setDetails(response.data.response.data);
    console.log("details:", details);
  };

  const handleBack = () => {
    setSelectedRecord(null);
    setDetails(null);
  };

  return (
    <Modal
      animationType="slide"
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={styles.container}>
        <View style={styles.data}>
          <View style={styles.header}>
            {selectedRecord ? (
              <TouchableOpacity onPress={handleBack} style={{paddingVertical: 4}}>
                <EntypoIcon name="chevron-left" size={24} color="black" />
              </TouchableOpacity>
            ) : (
              <Text style={styles.headerText}>지난 상담 기록</Text>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <EvilIcon name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {selectedRecord && details ? (
            <ScrollView>
            <View style={styles.detailContainer}>
              <Text>상담 날짜: {selectedRecord.counselRoom?.createdAt?.split('T')[0]}</Text>
              <Text>상담사: {details.counselor}</Text>
              <Text>제목: {details.summary.summaryShort}</Text>
              <Text>요약: {details.summary.summaryText}</Text>
              <Text>키워드 목록</Text>
              {details.keywords.map((keyword, index) => (
                <View key={index}>
                  <Text>{keyword}</Text>
                </View>
              ))}
              <Text>상담 내용: {details.fullText}</Text>
              <Text>상담 피드백: {details.feedback}</Text>
              <Text>상담 메모</Text>
              {details.memos.map((memo, index) => (
                <View key={index}>
                  <Text>{memo.createdAt}</Text>
                  <Text>{memo.memo}</Text>
                </View>
              ))}
            </View>
            </ScrollView>
          ) : (
            <FlatList
              data={records}
              keyExtractor={(item) => item.summaryId.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.recordItem}
                  onPress={() => handleRecordClick(item)}
                >
                  <View style={styles.recordContent}>
                    <View>
                      {user.userType === 'counselor' && (
                        <Text style={styles.recordDate}>
                          {item.counselRoom?.createdAt?.split('T')[0]} /{' '}
                          {item.user ? item.user.userName : '고객 이름 없음'}
                        </Text>
                      )}
                      {user.userType === 'customer' && (
                        <Text style={styles.recordDate}>
                          {item.counselRoom?.createdAt?.split('T')[0]}
                        </Text>
                      )}
                      <Text style={styles.recordTitle}>{item.summaryShort}</Text>
                    </View>
                    <EntypoIcon name="chevron-thin-right" size={18} color="black" />
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    width: '100%',
    height: '50%',
  },
  data: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 12,
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFCC00',
    color: 'black',
    fontSize: 13,
    textAlign: 'center',
    borderRadius: 8,
  },
  closeButton: {
    width: 24,
    height: 24,
  },
  recordItem: {
    padding: 16,
    backgroundColor: '#FFE580',
    borderRadius: 8,
    marginBottom: 8,
  },
  recordContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recordDate: {
    fontSize: 14,
  },
  recordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // detailContainer: {
  //   padding: 16,
  // },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  detailDate: {
    fontSize: 16,
    marginBottom: 8,
  },
  detailSummary: {
    fontSize: 14,
  },
});

export default RecordBottomModal;
