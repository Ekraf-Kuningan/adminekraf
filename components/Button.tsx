import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {colors} from '../constants/colors';

type ButtonProps = {
  on_press: () => void;
  btn_text: string;
};

export default function Button({on_press, btn_text}: ButtonProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}
      onPress={on_press}>
        <Text style={styles.buttonText}>{btn_text}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        width: '80%',
    },
    button: {
        justifyContent: 'center',
        backgroundColor: colors.primary,
        width: '100%',
        height: 50,
        marginVertical: 10,
        borderRadius :10,
        padding: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'Poppins-Medium',
        color: 'white',
        fontSize: 16,
        letterSpacing: 0.5,
        textAlign: 'center',
        position: 'relative',
    },
});
