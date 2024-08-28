import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export function TransactionMonthsDashboards({ transactionMonths, handleMonthYear }) {
    const [chartAnimation] = useState(new Animated.Value(0));
    const chartWidth = Math.max(screenWidth, transactionMonths.length * 70); // 70 px per data point

    useEffect(() => {
        Animated.timing(chartAnimation, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
        }).start();
    }, []);

    const chartTranslateX = chartAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-chartWidth, 0],
    });

    const getIncomeData = () => transactionMonths.map(month => month.incomeMonth);
    const getExpenseData = () => transactionMonths.map(month => month.expenseMonth);
    const getLabelsData = () => transactionMonths.map(month => (month.month + 1) + '/' + month.year);

    return (
        transactionMonths.length ? <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Receita vs Despesas Mensais</Text>
            <ScrollView horizontal>
                <Animated.View style={{ transform: [{ translateX: chartTranslateX }] }}>
                    <LineChart
                        data={{
                            labels: getLabelsData(),
                            datasets: [
                                {
                                    data: getIncomeData(),
                                    color: () => '#4CAF50',
                                },
                                {
                                    data: getExpenseData(),
                                    color: () => '#F44336'
                                },

                            ],
                        }}
                        width={chartWidth}
                        height={220}
                        chartConfig={{
                            backgroundColor: '#FFF',
                            backgroundGradientFrom: '#FFF',
                            backgroundGradientTo: '#FFF',
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: { borderRadius: 16 },
                            propsForDots: { r: '6', strokeWidth: '2', },
                        }}
                        bezier
                        style={{ marginVertical: 8, borderRadius: 16 }}
                        onDataPointClick={(data) => {
                            const selectedMonth = transactionMonths[data.index];
                            handleMonthYear(selectedMonth);
                        }}
                    />
                </Animated.View>
            </ScrollView>
        </View> : null
    );
}

export const styles = StyleSheet.create({
    chartContainer: {
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: '#FFF',
        borderRadius: 10,
        paddingVertical: 20,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
});
