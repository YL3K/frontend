// 상담 리스트 조회 페이지
import React from 'react';
import { View, Text, Button } from 'react-native';

function RecordListScreen({ navigation }) {
  return (
    <View>
      <Text>Record List Screen</Text>
      <Button
        title="Go to Record Detail"
        onPress={() => navigation.navigate('RecordDetail')}
      />
    </View>
  );
}

export default RecordListScreen;