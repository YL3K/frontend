import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const MainButton = ({ title, onPress, backgroundColor = '#FFCC00', color = '#000000', borderColor = "#FFCC00", style }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor, borderColor }, style]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MainButton;