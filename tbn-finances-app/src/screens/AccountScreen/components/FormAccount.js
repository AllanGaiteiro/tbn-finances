import React, { useEffect, useState } from 'react';
import { View, Button, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { accountStyles } from '../accountStyles';
import { InputAccountMembers } from './input/InputAccountMembers';
import { InputAccountAdminId } from './input/InputAccountAdminId';
import { InputAccountDescription } from './input/InputAccountDescription';
import { InputAccountName } from './input/InputAccountName';
import { useUser } from '../../../providers/UserProvider';
import { accountService } from '../../../services/AccountService';
import { DeleteButton } from './button/DeleteButton';
import { CancelButton } from './button/CancelButton';
import { EditButton } from './button/EditButton';
import { AccountEntity } from '../../../entity/AccountEntity';
import { SliderAccountIsSelected } from './SliderAccountIsSelected';

export const FormAccount = ({ accountData: item, expand: expandInit }) => {
    const { user } = useUser();
    const [accountData, setAccountData] = useState(item);
    const [expand, setExpand] = useState(expandInit || false);

    const handleSaveAccount = async () => {
        try {
            const today = new Date()

            if (accountData?.id) {
                await accountService.updateAccount({
                    id: accountData.id,
                    ...accountData,
                    lastUpdateDate: today
                });
            } else {
                await accountService.addAccount({
                    ...accountData,
                    creationDate: today,
                    lastUpdateDate: today
                });
                const newAccount = new AccountEntity();
                newAccount.adminId = user.uid;
                newAccount.members = [user.uid];
                setAccountData(newAccount);
            }

        } catch (error) {
            console.error('Erro ao salvar conta:', error);
        }
    };

    const handleDeleteAccount = async (accountId) => {
        try {
            await accountService.deleteAccount(accountId);
        } catch (error) {
            console.error('Erro ao excluir conta:', error);
        }
    };

    const editable = () => accountData.adminId === user.uid || !accountData?.id;

    return (
        <TouchableOpacity onPress={() => setExpand(!expand)}>
            <Card style={accountStyles.card}>
                <Card.Title style={accountStyles.cardTitle} title={!accountData?.id ? 'Criar Conta' : accountData.name} />
                {expand && (
                    <Card.Content style={accountStyles.container}>
                        <SliderAccountIsSelected
                            accountData={accountData}
                        />
                        <InputAccountName
                            accountData={accountData}
                            setAccountData={setAccountData}
                            editable={editable()} />
                        <InputAccountDescription
                            accountData={accountData}
                            setAccountData={setAccountData}
                            editable={editable()} />

                        <InputAccountAdminId
                            accountData={accountData}
                            setAccountData={setAccountData}
                            editable={editable()} />

                        <InputAccountMembers
                            accountData={accountData}
                            setAccountData={setAccountData}
                            editable={editable()} />
                        {!accountData?.id && (
                            <Button
                                title="Salvar"
                                mode="contained"
                                onPress={handleSaveAccount}
                                style={[accountStyles.button, accountStyles.saveButton]}
                            />
                        )}
                        {accountData?.id && (
                            <View style={accountStyles.editButtonContainer}>

                                <EditButton onPress={handleSaveAccount} />
                                <CancelButton onPress={() => setExpand(false)} />
                                <DeleteButton onPress={() => handleDeleteAccount(accountData.id)} />
                            </View>
                        )}
                    </Card.Content>
                )}
            </Card>
        </TouchableOpacity>
    );
};



