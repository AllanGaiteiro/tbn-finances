import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from './screens/DashboardScreen';
import ExpenseListScreen from './screens/ExpenseListScreen';
import IncomeListScreen from './screens/IncomeListScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline';
            } else if (route.name === 'Gastos') {
              iconName = 'ios-list';
            } else if (route.name === 'Rendas') {
              iconName = 'ios-cash';
            }

            // Pode usar qualquer ícone de sua preferência
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Gastos" component={ExpenseListScreen} />
        <Tab.Screen name="Rendas" component={IncomeListScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
