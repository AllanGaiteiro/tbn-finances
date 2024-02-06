import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'tomato',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    addButtonText: {
        color: 'white',
        marginLeft: 10,
    },
    incomeList: {
        width: '100%',
        marginTop: 20,
    },
    incomeItem: {
        backgroundColor: 'lightgray',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
    },
    incomeDescription: {
        fontSize: 18,
    },
    incomeAmount: {
        fontSize: 16,
        color: 'green',
    },
});
