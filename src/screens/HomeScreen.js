import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button
        title="Go to Member"
        onPress={() => navigation.navigate('Member')}
      />
      <Button
        title="Go to Counsel"
        onPress={() => navigation.navigate('Counsel')}
      />
      <Button
        title="Go to Record"
        onPress={() => navigation.navigate('Record')}
      />
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('Settings')}
      />
      <Button
        title="Go to Counter"
        onPress={() => navigation.navigate('Counter')}
      />
    </View>
  );
}

export default HomeScreen;
