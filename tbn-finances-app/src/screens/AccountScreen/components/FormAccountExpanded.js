import React, { useState } from 'react';
import { View, Button, } from 'react-native';
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
import { InputAccountCNPJ } from './input/InputAccountCNPJ';
import { SliderTypeSelected } from './SliderTypeSelected';

export function FormAccountExpanded({ accountData: item, setExpand }) {
    const { user } = useUser();
    const [formAccountData, setFormAccountData] = useState({ ...item });

    const handleDeleteAccount = async (accountId) => {
        try {
            await accountService.deleteAccount(accountId);
        } catch (error) {
            console.error('Erro ao excluir conta:', error);
        }
    };

    const handleSaveAccount = async () => {
        try {
            const today = new Date()

            if (formAccountData?.id) {
                await accountService.updateAccount({
                    id: formAccountData.id,
                    ...formAccountData,
                    lastUpdateDate: today
                });
            } else {
                await accountService.addAccount({
                    ...formAccountData,
                    creationDate: today,
                    lastUpdateDate: today
                });
                const newAccount = new AccountEntity();
                newAccount.adminId = user.uid;
                newAccount.members = [user.uid];
                setFormAccountData(newAccount);
            }

        } catch (error) {
            console.error('Erro ao salvar conta:', error);
        }
    };

    const disabled = () => {
        return !formAccountData.cnpj || !formAccountData.name || !formAccountData.type
    }

    const editable = () => formAccountData.adminId === user.uid || !formAccountData?.id;
    const haveCnpj = () => ['organization', 'igreja'].includes(formAccountData.type);

    return <Card.Content style={accountStyles.container}>
        {formAccountData?.id && <SliderAccountIsSelected
            accountData={formAccountData} />}
        <SliderTypeSelected
            accountData={formAccountData}
            setAccountData={setFormAccountData} />
        <View>

            {haveCnpj() ? (
                <InputAccountCNPJ
                    accountData={formAccountData}
                    setAccountData={setFormAccountData}
                    editable={editable()} />
            ) : null}
        </View>
        <InputAccountName
            accountData={formAccountData}
            setAccountData={setFormAccountData}
            editable={editable()} />
        <InputAccountDescription
            accountData={formAccountData}
            setAccountData={setFormAccountData}
            editable={editable()} />

        <InputAccountAdminId
            accountData={formAccountData}
            setAccountData={setFormAccountData}
            editable={editable()} />

        <InputAccountMembers
            accountData={formAccountData}
            setAccountData={setFormAccountData}
            editable={editable()} />
        {!formAccountData?.id && (
            <Button
                title="Salvar"
                mode="contained"
                onPress={handleSaveAccount}
                style={[accountStyles.button, accountStyles.saveButton]} />
        )}
        {formAccountData?.id && (
            <View style={accountStyles.editButtonContainer}>

                <EditButton disabled={disabled()} onPress={handleSaveAccount} />
                <CancelButton onPress={() => setExpand(false)} />
                <DeleteButton onPress={() => handleDeleteAccount(formAccountData.id)} />
            </View>
        )}
    </Card.Content>;
}
