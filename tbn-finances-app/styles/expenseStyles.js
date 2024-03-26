import { StyleSheet } from "react-native";

export const expenseStyles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    innerContainer: {
        padding: 20,
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5', // Um fundo claro
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
        color: '#333',
    },
    incomeList: {
        flex: 1,
        paddingHorizontal: 10,
        height:500
    },
    incomeItem: {
        backgroundColor: '#FFFFFF', // Fundo branco para os cartões
        borderLeftColor: '#4CAF50',
        borderLeftWidth: 4,
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000', // Sombra para dar um efeito "elevado"
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4, // Necessário para sombra no Android
        flexDirection: 'row', // Itens em linha
        justifyContent: 'space-between', // Espaço entre os itens
        alignItems: 'center', // Centraliza os itens verticalmente
    },
    incomeType: {
        fontSize: 18,
        fontWeight: '500',
        color: '#4CAF50', // Cor verde para destacar o tipo
    },
    incomeAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    incomeDate: {
        fontSize: 16,
        color: '#757575', // Cor suave para as datas
    },
    emptyMessage: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: '#757575',
    },
    
    form: {
        marginVertical: 20,
        borderRadius: 10,
        backgroundColor: '#f8f8f8',
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    datePicker: {
        width: '100%',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    pickerContainer: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 15,
        overflow: 'hidden',
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 16,
        color: '#aaa',
        marginTop: 20,
    },    
});

