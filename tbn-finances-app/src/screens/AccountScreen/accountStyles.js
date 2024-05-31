import { StyleSheet } from 'react-native';

export const accountStyles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    input: {
        marginBottom: 10,
        backgroundColor: '#F4F4F4',
        padding: 10,
        borderRadius: 5,
    },
    input: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
    },
    label: {
        marginBottom: 5,
        color: '#777',
    },
    button: {
        marginTop: 10,
        borderRadius: 5,
    },
    saveButton: {
        backgroundColor: '#4CAF50', // Green
    },
    editButtonContainer: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    editButton: {
        backgroundColor: '#4CAF50', // Green
        width: '48%',
        borderColor: '#4CAF50', // Green
        borderWidth: 1,
    },
    editButtonText: {
        color: '#FFFFFF', // White
    },
    card: {
        marginBottom: 20,
    },
    cardTitle: {
        marginBottom: 10,
    },
});
