import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useUser } from '../../../providers/UserProvider';
import { userService } from '../../../services/UserService';
import { useAccount } from '../../../providers/AccountProvider';


const statusOptions = [
  { label: 'Selectionado', value: true, active: false, color: 'blue' },
];

export const SliderAccountIsSelected = ({ accountData, disabled = false, stylesWidth = { width: 'auto' }, stylesPaddingHorizontal = { paddingHorizontal: 40 } }) => {
  const { user, } = useUser();
  const { account, updateAccount } = useAccount()
  const [accountSelected, setAccountSelected] = useState(accountData?.id && account === accountData?.id);

  useEffect(() => {
    setAccountSelected(accountData?.id && account === accountData?.id);
  }, [account])

  const updateAccountSelected = () => {
    if (!accountSelected && accountData.id && account !== accountData.id) {
      userService.updateAccountSelected(user.uid, accountData.id)
        .then(() => updateAccount(accountData.id));

    }
  }

  const getBackgroundColor = (value) => {
    const statusOption = statusOptions.find(option => option.value === value);
    return statusOption ? statusOption.color : '#ccc'; // cor padrão se não encontrado
  };

  return (
    <View style={[styles.sliderContainer, stylesWidth]}>
      {statusOptions.map((option) => (
        <TouchableOpacity
          key={option.value}
          disabled={disabled}
          style={[
            styles.sliderOption,
            stylesPaddingHorizontal,
            accountSelected ? { ...styles.activeOption, backgroundColor: getBackgroundColor(option.value) } : styles.inactiveOption
          ]}
          onPress={() => {
            updateAccountSelected()
          }}
        >
          <Text style={[
            styles.sliderOptionText,
            accountSelected ? styles.activeText : styles.inactiveText
          ]}>{option.label}</Text>
        </TouchableOpacity>
      ))
      }
    </View >
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