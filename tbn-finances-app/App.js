import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MainTabNavigator } from './src/Navigator/MainTabNavigator';
import { AuthNavigator } from './src/Navigator/AuthNavigator';
import { UserProvider } from './src/providers/UserProvider';
import { userAuthService } from './src/services/UserAuthService';
import { userService } from './src/services/UserService';
import { AccountProvider } from './src/providers/AccountProvider';
import { ActivityIndicator } from 'react-native';
import { accountRepository } from './src/repositories/AccountRepository';


function App() {
  const [userAuth, setUserAuth] = useState(null);
  const [accountSelected, setAccountSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = userAuthService.monitorAuthState(async user => {
      setUserAuth(user);
    });
    return () => unsubscribe(); // Certifique-se de retornar a função de limpeza corretamente
  }, []);

  useEffect(() => {
    if (!userAuth) return;
    const unsubscribe = userService.repository.observeUserByUid(userAuth.uid,async (userData) => {
      const accounId = userData?.accountSelected ? userData?.accountSelected : '';
      const account = await accountRepository.getAccountById(accounId)
      setAccountSelected(account);
      setLoading(false)
    })
    return () => unsubscribe();
  }, [userAuth]);

  return (

    <NavigationContainer>
      {userAuth ?
        (
          <UserProvider user={userAuth}>
            {!loading ?
              <AccountProvider initialAccount={accountSelected}>
                <MainTabNavigator />
              </AccountProvider> :
              <ActivityIndicator />
            }
          </UserProvider>
        ) :
        <AuthNavigator />
      }

    </NavigationContainer>

  );
}
export default App;

