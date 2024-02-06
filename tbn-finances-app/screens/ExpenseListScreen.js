
import { View, Text, StyleSheet, Button } from 'react-native';
import { styles } from './styles';

const ExpenseListScreen = ({ navigation }) => {
    // Lógica para listar e adicionar gastos

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Gastos</Text>
            {/* Adicione aqui a lista de gastos e botões */}
        </View>
    );
};


export default ExpenseListScreen;