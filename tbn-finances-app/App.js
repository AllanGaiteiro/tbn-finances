import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from './screens/DashboardScreen';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';
import { TransactionScreen } from './screens/TransactionScreen/TransactionScreen';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let routeColor;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'ios-stats-chart' : 'ios-stats-chart-outline';
              routeColor = '#2196F3'; // Azul
            } else if (route.name === 'Balanço') {
              iconName = 'ios-wallet';
              routeColor = '#F44336'; // Vermelho
            } else if (route.name === 'Rendas') {
              iconName = 'ios-cash';
              routeColor = '#4CAF50'; // Verde
            }

            return <Ionicons name={iconName} size={size} color={routeColor} />;
          },
          tabBarLabel: ({ focused, color }) => {
            let label;
            let labelColor = focused ? color : 'gray'; // Altera a cor do texto baseada no foco

            if (route.name === 'Dashboard') {
              label = 'Dashboard';
            } else if (route.name === 'Balanço') {
              label = 'Balanço';
            } else if (route.name === 'Rendas') {
              label = 'Rendas';
            }

            // Retorna um componente personalizado para tabBarLabel, se necessário
            return <Text style={{ color: labelColor, fontSize: 12 }}>{label}</Text>;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Balanço" component={TransactionScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
export default App;
