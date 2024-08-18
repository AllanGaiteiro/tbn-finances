import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const TypesSlider = ({ options, currentType, onTypeChange, onlyValue = true }) => {
  const optValue = (option) => option?.id || option?.value;
  const currentTypeValue = () => currentType?.id || currentType;

  return (
    <View style={styles.sliderContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={optValue()}
          style={[
            styles.sliderOption,
            currentTypeValue() === optValue(option) ? { ...styles.activeOption, backgroundColor: '#2196F3' } : styles.inactiveOption
          ]}
          onPress={() => onTypeChange(onlyValue ? option?.value : option)}
        >
          <Text style={[
            styles.sliderOptionText,
            currentTypeValue() === optValue(option) ? styles.activeText : styles.inactiveText
          ]}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,

  },
  sliderOption: {
    padding: 10,
    borderRadius: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeOption: {
    backgroundColor: '#4CAF50',
  },
  inactiveOption: {
    //backgroundColor: '#ccc', // Cor de fundo para opções inativas
  },
  sliderOptionText: {
    textAlign: 'center',
  },
  activeText: {
    color: '#fff', // Texto branco para melhor contraste em opções ativas
  },
  inactiveText: {
    color: '#000', // Texto preto para opções não selecionadas
  },
});