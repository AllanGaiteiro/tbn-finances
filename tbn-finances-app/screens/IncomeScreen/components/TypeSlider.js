import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const typesOptions = [
  { label: 'Alçada', value: 'oferta_alcada', color: '#2196F3' },
  { label: 'Voluntaria', value: 'oferta_voluntaria', color: '#2196F3' },
  { label: 'Mensal', value: 'oferta_mensal', color: '#2196F3' },
];
export const TypesSlider = ({ currentType, onTypeChange }) => {
  // Função para determinar a cor de fundo com base no status atual
  const getBackgroundColor = (value) => {
    const typesOption = typesOptions.find(option => option.value === value);
    return typesOption ? typesOption.color : '#ccc'; // cor padrão se não encontrado
  };

  return (
    <View style={styles.sliderContainer}>
      {typesOptions.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.sliderOption,
            currentType === option.value ? { ...styles.activeOption, backgroundColor: getBackgroundColor(option.value) } : styles.inactiveOption
          ]}
          onPress={() => onTypeChange(option.value)}
        >
          <Text style={[
            styles.sliderOptionText,
            currentType === option.value ? styles.activeText : styles.inactiveText
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