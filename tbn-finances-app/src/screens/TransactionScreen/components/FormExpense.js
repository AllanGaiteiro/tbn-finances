import React, { useState } from 'react';
import { ButtonSave } from '../../../components/ButtonSave';
import { ButtonBack } from '../../../components/ButtonBack';
import { ExpenseInputType } from './input/ExpenseInputType';
import { ExpenseInputAmount } from './input/ExpenseInputAmount';
import { ExpenseInputTotalInstallments } from './input/ExpenseInputTotalInstallments';
import { ExpenseInputDescription } from './input/ExpenseInputDescription';
// import { ExpenseInputImage } from './input/ExpenseInputImage';
import { Expense } from '../../../entity/Expense';
import { ExpenseInputDueDateWeb } from './input/ExpenseInputDueDateWeb';
import { ExpenseInputDueDateMobile } from './input/ExpenseInputDueDateMobile';
import { ExpenseInputPaymentDateMobile } from './input/ExpenseInputPaymentDateMobile';
import { ExpenseInputPaymentDateWeb } from './input/ExpenseInputPaymentDateWeb';
import { transactionRepository } from '../../../repositories/TransactionRepository';
import { useAccount } from '../../../providers/AccountProvider';
import { ActivityIndicator } from 'react-native-paper';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { firebaseService } from '../../../services/FirebaseService';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';

export function FormExpense({ expense: expenseItem = new Expense(), isFormVisible, setIsFormVisible }) {
    const [expense, setExpense] = useState(expenseItem);
    const { account } = useAccount();
    const [loading, setLoading] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);

    const selectImage = (fromCamera) => {
        const options = { mediaType: 'photo', quality: 1 };
        const callback = (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.error('ImagePicker Error: ', response.error);
            } else {
                setImageUri(response.assets[0].uri);
            }
        };

        if (fromCamera) {
            launchCamera(options, callback);
        } else {
            launchImageLibrary(options, callback);
        }
    };

    const uploadImage = async () => {
        if (imageUri == null) {
            Alert.alert("Nenhuma imagem selecionada");
            return;
        }

        const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
        const uploadUri = imageUri;

        setUploading(true);
        setTransferred(0);

        console.log(filename, uploadUri)
        const storageRef = firebaseService.getStorageRef('some-child/' + filename);
        console.log(storageRef)

        const task = uploadBytesResumable(storageRef, uploadUri);
        task.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setTransferred(Math.round(progress));
            },
            (error) => {
                // Handle unsuccessful uploads
                console.error(error);
            },
            () => {
                // Handle successful uploads on complete
                console.log('Upload complete');
            }
        );

        try {
            await task;
            const downloadUrl = await getDownloadURL(storageRef);
            Alert.alert("Imagem enviada!", "Sua imagem do boleto foi enviada com sucesso ao Firebase.");
            setUploading(false);
            setImageUri(null);
        } catch (e) {
            console.error(e);
            Alert.alert("Erro", "Não foi possível enviar a imagem.");
            setUploading(false);
        }
    };

    const formValidateAmount = (expense) => !expense.amount || isNaN(expense.amount) || expense.amount <= 0;
    const formValidateType = (expense) => !expense.type;
    const formValidateDescription = (expense) => !expense.description;
    const formValidate = () => formValidateAmount(expense) || formValidateType(expense) || formValidateDescription(expense);


    const validateForm = () => {
        const title = 'Erro';
        const message = "Por favor, selecione um";
        if (formValidateType(expense)) {
            Alert.alert(title, message + " tipo de renda.");
            return false;
        }
        if (formValidateAmount(expense)) {
            Alert.alert(title, message + " montante válido.");
            return false;
        }
        if (formValidateDescription(expense)) {
            Alert.alert(title, message + " a descrição.");
            return false;
        }
        return true;
    };

    const handleSetExpense = async () => {
        setLoading(false)

        if (validateForm()) {

            try {
                if (expense.id && expense.type === 'mensal') {
                    await transactionRepository(account.id).expense.updateExpense(expense);
                } else if (expense.id) {
                    expense.lastUpdateDate = new Date();
                    await transactionRepository(account.id).expense.updateExpense(expense);
                } else {
                    expense.creationDate = new Date();
                    await transactionRepository(account.id).expense.addExpense(expense);
                }

                setExpense(new Expense()); // Reinicie o formulário
                setIsFormVisible(false); // Esconda o formulário
            } catch (e) {
                console.error("Erro ao adicionar documento: ", e);
                Alert.alert("Erro", "Não foi possível adicionar a despesa.");
            }
            setLoading(true)
        }

    };


    return (
        <View style={styles.form}>
            <Text style={styles.title}>{expense.id ? 'Detalhes da' : 'Adicionar'} Despesa</Text>
            <ExpenseInputType accountData={account} expense={expense} setExpense={setExpense} />
            <ExpenseInputDescription expense={expense} setExpense={setExpense} />
            <ExpenseInputTotalInstallments expense={expense} setExpense={setExpense} />
            <ExpenseInputAmount expense={expense} setExpense={setExpense} />

            <ExpenseInputDueDateWeb isVisible={expense.id} expense={expense} setExpense={setExpense} />
            <ExpenseInputDueDateMobile isVisible={expense.id} setExpense={setExpense} />

            <ExpenseInputPaymentDateWeb isVisible={expense.id} expense={expense} setExpense={setExpense} />
            <ExpenseInputPaymentDateMobile isVisible={expense.id} setExpense={setExpense} />

            <Text style={styles.label}>Foto do Boleto:</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.iconButton} onPress={() => selectImage(true)}>
                    <Ionicons name="camera" size={40} color="#2196F3" />
                    <Text style={styles.buttonText}> Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() => selectImage(false)}>
                    <Ionicons name="image" size={40} color="#2196F3" />
                    <Text style={styles.buttonText}> Galeria</Text>
                </TouchableOpacity>
            </View>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            {imageUri && <TouchableOpacity style={styles.uploadButton} onPress={uploadImage} disabled={uploading}>
                <Ionicons name="cloud-upload" size={40} color="#2196F3" />
                <Text style={styles.buttonText}>Confirmar Imagem e Salvar</Text>
            </TouchableOpacity>}
            {uploading && (
                <View style={styles.progressBarContainer}>
                    <Text>{transferred}% Concluído</Text>
                </View>
            )}

            {loading ? (
                <ActivityIndicator size={25} color="#0000ff" />
            ) : (
                <View style={styles.datePickerContainer}>
                    <ButtonSave formValidate={formValidate} save={handleSetExpense} />
                    <ButtonBack setIsFormVisible={setIsFormVisible} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    form: {
        minWidth: 350,
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
        color: '#333',
    },
    label: {
        fontSize: 16,
        marginVertical: 10,
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    iconButton: {
        maxWidth: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: '#2196F3',
        borderWidth: 2,
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#2196F3',
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    image: {
        width: 200,
        height: 200,
        margin: 'auto',
        marginVertical: 20,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: '#2196F3',
        borderWidth: 2,
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        justifyContent: 'center',
    },
    progressBarContainer: {
        marginVertical: 20,
        alignItems: 'center',
    },
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
