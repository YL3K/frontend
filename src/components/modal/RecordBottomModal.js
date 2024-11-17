import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import { useSelector } from 'react-redux';

const RecordBottomModal = ({ isVisible, onClose }) => {
  const user = useSelector((state) => state.user.user);
  const today = new Date();

  const [userType, setUserType] = useState("");
  const [records, setRecords] = useState([]);
  const startDate = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
  const endDate = today;

  const fetchRecords = async () => {
    await axios.get(`http://10.0.2.2:8080/api/record/`, {
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
      setUserType(response.data.userType);
      setRecords(response.data.summaries);
      console.log(response.data);
    })
    .catch(error => {
      console.error("Error fetching records:", error);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (    
    <Modal
      animationType="slide"
      visible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={styles.container}>
        <View style={styles.data}>
          <View style={styles.header}>
            <Text style={styles.headerText}>지난 상담 기록</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <EvilIcon name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={records}
            keyExtractor={item => item.summaryId.toString()}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity
                  style={styles.recordItem}
                  // onPress={() => navigation.navigate('RecordDetail', { summaryId: item.summaryId })}
                >
                  <View style={styles.recordContent}>
                    <View>
                      {userType === "counselor" && (
                        <Text style={styles.recordDate}>
                          {item.counselRoom?.createdAt?.split("T")[0]} / {item.user ? item.user.userName : "고객 이름 없음"}
                        </Text>
                      )}
                      {userType === "customer" && (
                        <Text style={styles.recordDate}>
                          {item.counselRoom?.createdAt?.split("T")[0]}
                        </Text>
                      )}
                      <Text style={styles.recordTitle}>{item.summaryShort}</Text>
                    </View>
                    <EntypoIcon name="chevron-thin-right" size={18} color="black" />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
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
    borderRadius: 8
  },
  closeButton: {
    width: 24,
    height: 24,
  },
  recordItem: {
    padding: 16,
    backgroundColor: "#FFE580",
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
    fontWeight: "bold",
  },
});

export default RecordBottomModal;