import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Animated } from 'react-native';
import { transactionRepository } from '../../../repositories/TransactionRepository';
import { useAccount } from '../../../providers/AccountProvider';
import { useTransactionFilters } from '../../../providers/TransactionFilterProvider';
import { TransactionMonthsDashboards } from './TransactionMonthsDashboards';
import { TransactionSumaryMonth } from './TransactionSumaryMonth';
import { TransactionCardCalendarTitle } from './titles/TransactionCardCalendarTitle';
import { TransactionCardListByMonth } from './TransactionCardListByMonth';

export const TransactionSectionMonth = () => {
    const [transactionMonths, setTransactionMonths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [monthsToLoad, setMonthsToLoad] = useState({ after: 3, before: 3 });
    const { filters, setFilters } = useTransactionFilters();
    const { account } = useAccount();
    const [showDash, setShowDash] = useState(false);
    const animatedValue = new Animated.Value(1);

    const loadMonths = useCallback(() => {
        if (!account) return;
        setLoading(true);

        const unsub = transactionRepository(account.id).observeTransactionAmountByMonth(
            (months) => {
                setTransactionMonths(months.sort((a, b) => {
                    if (a.year === b.year) {
                        return a.month - b.month;
                    }
                    return a.year - b.year;
                }));
                setLoading(false);
            },
            setLoading,
            monthsToLoad
        );

        return () => unsub();
    }, [account.id, monthsToLoad]);

    useEffect(() => {
        loadMonths();
    }, [account.id, monthsToLoad]);

    const handleMonthYear = (transactionMonth) => {
        setFilters({
            ...filters,
            status: null,
            month: transactionMonth.month,
            year: transactionMonth.year,
        });
    };

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(animatedValue, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start(() => setShowDash(!showDash));
    };

    if (loading && !transactionMonths.length) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <View style={styles.sliderContainer}>
            <ScrollView horizontal contentContainerStyle={styles.scrollViewContent}>
                <TransactionCardCalendarTitle />
                <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={styles.flexEnd}>
                    <Animated.View style={[
                        styles.button,
                        {
                            transform: [{ scale: animatedValue }],
                            backgroundColor: showDash ? '#2196F3' : 'transparent',
                            borderWidth: showDash ? 0 : 2,
                            borderColor: '#2196F3',
                        }
                    ]}>
                        <Text style={[
                            styles.buttonText,
                            { color: showDash ? '#FFF' : '#2196F3' }
                        ]}>
                            Dash
                        </Text>
                    </Animated.View>
                </TouchableOpacity>
            </ScrollView>

            {showDash ? (
                <TransactionMonthsDashboards transactionMonths={transactionMonths} handleMonthYear={handleMonthYear} />
            ) : (
                <TransactionSumaryMonth />
            )}

            <TransactionCardListByMonth transactionMonths={transactionMonths} handleMonthYear={handleMonthYear} monthsToLoad={monthsToLoad} setMonthsToLoad={setMonthsToLoad} />
        </View>
    );
};

export const styles = StyleSheet.create({
    sliderContainer: {
        paddingLeft: 10,
        paddingTop: 0,
        marginRight: 10,
        marginBottom: 20,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    flexEnd: {
        flex: 1,
        justifyContent: 'flex-end',
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
