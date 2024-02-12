import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const statusOptions = [
  { label: 'Cancelado', value: 'cancelado', color: '#F44336' }, // Vermelho
  { label: 'Em Progresso', value: 'em_progresso', color: '#2196F3' }, // Azul
  { label: 'Recebido', value: 'recebido', color: '#4CAF50' }, // Verde
];

export const StatusSlider = ({ currentStatus, onStatusChange }) => {
  // Função para determinar a cor de fundo com base no status atual
  const getBackgroundColor = (value) => {
    const statusOption = statusOptions.find(option => option.value === value);
    return statusOption ? statusOption.color : '#ccc'; // cor padrão se não encontrado
  };

  return (
    <View style={styles.sliderContainer}>
      {statusOptions.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.sliderOption,
            currentStatus === option.value ? { ...styles.activeOption, backgroundColor: getBackgroundColor(option.value) } : styles.inactiveOption
          ]}
          onPress={() => onStatusChange(option.value)}
        >
          <Text style={[
            styles.sliderOptionText,
            currentStatus === option.value ? styles.activeText : styles.inactiveText
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