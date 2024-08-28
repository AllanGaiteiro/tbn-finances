import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';


export function TransactionCardListByMonth({ transactionMonths, handleMonthYear, monthsToLoad, setMonthsToLoad }) {
    const scrollViewRef = React.useRef(null);

    const handleScroll = (event) => {
        const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
        const newMonthsToLoad = {
            after: monthsToLoad.after,
            before: monthsToLoad.before,
        };

        const moreBefore = contentOffset.x <= 50;
        const moreAfter = layoutMeasurement.width + contentOffset.x >= contentSize.width - 50;

        if (moreBefore) newMonthsToLoad.before += 1;
        if (moreAfter) newMonthsToLoad.after += 1;

        if (newMonthsToLoad.before !== monthsToLoad.before || newMonthsToLoad.after !== monthsToLoad.after) {
            setMonthsToLoad(newMonthsToLoad);
        }
    };

    const getBorderColorByStatus = (status) => {
        switch (status) {
            case 'receved': return '#4CAF50';
            case 'em_progress': return '#2196F3';
            case 'pay': return '#F44336';
            default: return '#757575';
        }
    };

    const isFutureMonth = (transactionMonth) => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        if (transactionMonth.year > currentYear) return true;
        if (transactionMonth.year === currentYear && transactionMonth.month > currentMonth) return true;
        return false;
    };
    return <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        ref={scrollViewRef}
    >
        {transactionMonths.map((transactionMonth, index) => (
            <TouchableOpacity key={index}
                onPress={() => handleMonthYear(transactionMonth)}
                style={[
                    styles.monthItem,
                    isFutureMonth(transactionMonth) && styles.monthItemFuture
                ]}>
                <Text style={styles.month}>{transactionMonth.monthId}</Text>

                <View style={styles.row}>
                    <Text style={[styles.label]}>Receita: </Text>
                    <Text style={[styles.monthTotal, { color: getBorderColorByStatus(isFutureMonth(transactionMonth) ? 'em_progress' : 'receved') }]}>R$ {transactionMonth?.incomeMonth || '0,00'}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Despesas: </Text>
                    <Text style={[styles.monthTotal, { color: getBorderColorByStatus('pay') }]}>R$ {transactionMonth.expenseMonth || '0,00'} </Text>
                </View>

            </TouchableOpacity>
        ))}
    </ScrollView>;
}

export const styles = StyleSheet.create({
    monthItem: {
        width: 200,
        marginRight: 15,
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
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
    monthItemFuture: {
        backgroundColor: '#DDE8F9', borderWidth: 1, borderColor: '#0B57D0'
    },
    month: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    monthTotal: {
        fontSize: 16,
        fontWeight: '500',
        color: '#4CAF50',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 16,
        color: '#666',
    },
});