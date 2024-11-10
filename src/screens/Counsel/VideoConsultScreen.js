// 화상 상담 페이지
import React from 'react';
import { View, Text, Button } from 'react-native';

function VideoConsultScreen({ navigation }) {
  return (
    <View>
      <Text>Video Consult Screen</Text>
      <Button
        title="Go to End Session"
        onPress={() => navigation.navigate('EndSession')}
      />
    </View>
  );
}

export default VideoConsultScreen;