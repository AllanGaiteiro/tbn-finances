import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit'; // Assuming you're using react-native-chart-kit for pie charts

export function TransactionPieChart({ title, data }) {
    const screenWidth = Dimensions.get('window').width;

    return <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>{title}</Text>
        <PieChart
            data={data.map(d => ({ name: d.name, population: d.count, color: d.color, legendFontColor: '#7F7F7F', legendFontSize: 15 }))}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
                backgroundColor: '#FFF',
                backgroundGradientFrom: '#FFF',
                backgroundGradientTo: '#FFF',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute />
    </View>;
}

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
        marginBottom: 10
    },
    chartContainer: {
        marginTop: 10,
        marginBottom: 10,
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
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    flexEnd: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    container: {
        paddingLeft: 10,
        paddingTop: 0,
        marginRight: 10,
        marginBottom: 20,
    },
    button: {
        padding: 10,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});