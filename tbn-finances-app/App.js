import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { firebaseService } from './src/settings/FirebaseService';
import { MainTabNavigator } from './src/Navigator/MainTabNavigator';
import { AuthNavigator } from './src/Navigator/AuthNavigator';
import { UserProvider } from './src/providers/UserProvider';


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebaseService.monitorAuthState(user => {
      setUser(user);
    });
    return () => unsubscribe(); // Certifique-se de retornar a função de limpeza corretamente
  }, []);

  return (
   
      <NavigationContainer>
        {user ?  <UserProvider user={user}><MainTabNavigator /></UserProvider> : <AuthNavigator />}
      </NavigationContainer>
    
  );
}
export default App;

