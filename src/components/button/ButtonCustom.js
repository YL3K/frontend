import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const ButtonCustom = ({ title, onPress, backgroundColor = '#FFCC00', color =  '#000000' }) => {
  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor}]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, {color}]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 30
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'semibold'
  }
});

export default ButtonCustom;