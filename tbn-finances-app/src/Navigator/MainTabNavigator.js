import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';
import { TransactionScreen } from '../screens/TransactionScreen/TransactionScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
export const Tab = createBottomTabNavigator();

export function MainTabNavigator() {
  return <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        let routeColor;
        if (route.name === 'Balanço') {
          iconName = 'ios-wallet';
          routeColor = '#F44336'; // Vermelho
        }

        return <Ionicons name={iconName} size={size} color={routeColor} />;
      },
      tabBarLabel: ({ focused, color }) => {
        let label;
        let labelColor = focused ? color : 'gray'; // Altera a cor do texto baseada no foco

        if (route.name === 'Balanço') {
          label = 'Balanço';
        }

        // Retorna um componente personalizado para tabBarLabel, se necessário
        return <Text style={{ color: labelColor, fontSize: 12 }}>{label}</Text>;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    })}
  >

    <Tab.Screen name="Balanço" component={TransactionScreen} />
  </Tab.Navigator>;
}
