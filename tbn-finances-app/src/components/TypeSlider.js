import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const TypesSlider = ({ options, currentType, onTypeChange, onlyValue = true }) => {
  const optValue = (option) => option?.id || option?.value;
  const currentTypeValue = () => currentType?.id || currentType;

  return (
    <View>
      <Text>Selecione o Tipo de Entrada:</Text>
      <View style={styles.sliderContainer}>
        {options.map((option, i) => (
          <TouchableOpacity
            key={i}
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
    </View>

  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    marginTop: 0,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    flexWrap: 'wrap',
    borderWidth: 1,
    borderRadius: 20,
     borderColor: '#ccc',
  },
  sliderOption: {
    margin: 5,
    padding: 10,
    borderRadius: 20,
    borderWidth: 0,
    backgroundColor: '#F5F8FD',
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