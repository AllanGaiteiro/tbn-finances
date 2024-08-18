import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useUser } from '../../providers/UserProvider';
import { AccountEntity } from '../../entity/AccountEntity';
import { FormAccount } from './components/FormAccount';
import { accountService } from '../../services/AccountService';
import { accountTypeRepository } from '../../repositories/AccountTypeRepository';

export const AccountScreen = () => {
  const { user } = useUser();
  const [accounts, setAccounts] = useState([]);
  const [newAccountData, setNewAccountData] = useState(new AccountEntity());
  const [loadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    newAccountData.adminId = user.uid;
    newAccountData.members = [user.uid];
    setNewAccountData(newAccountData);
  }, [newAccountData]);

  useEffect(() => {
    const unsubscribe = accountService.getAccountsByUserId(user, setAccounts, setIsLoadingUser);
    return () => unsubscribe();
  }, [user]);

  const renderItem = ({ item }) => (
    <FormAccount
      key={item.id}
      accountData={item}
      expand={false}
    />
  );

  return (
    <View style={styles.container}>
      <FormAccount
        accountData={newAccountData}
        expand={false}
      />
      {accounts.length > 0 && <Text style={styles.title}> Lista de Contas e Eventos</Text>}

      {loadingUser ? (
        <ActivityIndicator style={styles.loading} />
      ) : (
        <FlatList
          data={accounts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          ListEmptyComponent={<Text style={styles.emptyList}>Não há contas disponíveis</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  item: {
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  emptyList: {
    textAlign: 'center',
    marginTop: 10,
  },
  loading: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#333',
  },
});
