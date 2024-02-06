import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from './screens/DashboardScreen'; // Importe sua tela de Dashboard
import ExpenseListScreen from './screens/ExpenseListScreen'; // Importe sua tela de Lista de Gastos
import IncomeListScreen from './screens/IncomeListScreen'; // Importe sua tela de Lista de Rendas

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Gastos" component={ExpenseListScreen} />
        <Stack.Screen name="Rendas" component={IncomeListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
