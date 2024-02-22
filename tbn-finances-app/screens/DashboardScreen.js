import { View, Text, Button } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { styles } from '../styles/styles';

const DashboardScreen = ({ navigation }) => {
    // Exemplo de dados para o gráfico de linha
    const data = {
        labels: ["Janeiro", "Fevereiro", "Março"],
        datasets: [
            {
                data: [300, 600, 800]
            }
        ]
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard de Gastos x Rendas</Text>
            <LineChart
                data={data}
                width={400} // largura do gráfico
                height={220} // altura do gráfico
                chartConfig={chartConfig}
            />
            {/* Adicione aqui mais componentes de UI conforme necessário */}
        </View>
    );
};

const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    // outras configurações de estilo
};

export default DashboardScreen;
