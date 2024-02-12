import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

const RecurrenceSwitch = ({ isRecurrence, onToggle }) => {
    const [animate, setAnimate] = useState(new Animated.Value(isRecurrence ? 1 : 0));
  
    useEffect(() => {
      Animated.timing(animate, {
        toValue: isRecurrence ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }, [isRecurrence]);
  
    const backgroundColor = animate.interpolate({
      inputRange: [0, 1],
      outputRange: ['#f5f5f5', '#2196F3'],
    });

    const textColor = animate.interpolate({
        inputRange: [0, 1],
        outputRange: ['#000', '#FFF'], // Preto quando não clicado, branco quando clicado
    });
  
    const toggleRecurrence = () => {
      onToggle(!isRecurrence);
    };
  
    return (
      <TouchableOpacity onPress={toggleRecurrence} style={styles.switchContainer}>
        <Animated.View style={[styles.background, { backgroundColor }]}>
          <Animated.Text style={[styles.label, { color: textColor }]}>{'Oferta Mensal'}</Animated.Text>
        </Animated.View>
      </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    switchContainer: {
      width: '100%',
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: '#2196F3',
      justifyContent: 'center',
      overflow: 'hidden',
      display: 'block',
    },
    background: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
    },
});
  
export default RecurrenceSwitch;
