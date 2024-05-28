import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const statusOptions = [
  { label: 'Despesas', value: 'expense', active: false, color: '#F44336' }, // Vermelho
  { label: 'Ofertas', value: 'income', active: false, color: '#4CAF50' }, // Verde
];

export const TypeTransactionSlider = ({ typeTransaction, setTypeTransaction }) => {
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
            typeTransaction === option.value ? { ...styles.activeOption, backgroundColor: getBackgroundColor(option.value) } : styles.inactiveOption
          ]}
          onPress={() => {
            option.active = !option.active;
            setTypeTransaction(option.active ? option.value : null)
          }}
        >
          <Text style={[
            styles.sliderOptionText,
            typeTransaction === option.value ? styles.activeText : styles.inactiveText
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
    paddingHorizontal: 40,
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