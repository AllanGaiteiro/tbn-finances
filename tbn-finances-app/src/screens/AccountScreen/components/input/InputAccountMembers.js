import React, { useEffect, useState } from 'react';
import { View, Text, Modal, FlatList, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { accountStyles } from '../../accountStyles';
import { AccountAddUser } from '../AccountAddUser';
import { MemberBalloon } from '../MemberBalloon';
import { userService } from '../../../../services/UserService';

export function InputAccountMembers({ accountData, setAccountData, editable }) {
    const [isModalVisible, setIsModalVisible] = useState(false); // Estado do modal de seleção de membros
    const [userMembars, setUserMembars] = useState([])

    useEffect(() => {

        if (accountData?.members?.length) {
            fetchMenbers(accountData.members);
        }
    }, [accountData]);

    // Função para abrir o modal de seleção de membros
    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    // Função para selecionar um membro
    const handleSelectMember = (member) => {
        const updatedMembers = accountData.members.includes(member)
            ? accountData.members.filter((m) => m !== member)
            : [...accountData.members, member];

        setAccountData({ ...accountData, members: updatedMembers });
    };

    const fetchMenbers = async (members) => {
        try {
            const users = (await userService.repository.getUsersByUids(members))
            setUserMembars(users)
        } catch (error) {
            console.error('Erro ao buscar o nome dos membros:', error);
        }
    };


    return accountData?.id && (
        <View>
            <View style={accountStyles.editButtonContainer}>
                <View>
                    <Text style={accountStyles.label}>Lista de Associados</Text>
                    {userMembars.length > 0 ?
                        userMembars.map((m) => <MemberBalloon key={m.uid} member={m.displayName} />) :
                        <MemberBalloon member={'Somente Admin'} />}
                </View>

                {
                    // <AccountAddUser handleOpenModal={handleOpenModal} />
                }
            </View>
            {/*
                <Modal visible={isModalVisible} animationType="slide">
                    <View style={styles.modalContainer}>
                        <FlatList
                            data={accountData?.availableMembers}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSelectMember(item)} style={styles.memberItem}>
                                    <Text style={styles.memberText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item}
                        />
                        <Button title="Fechar" onPress={() => setIsModalVisible(false)} />
                    </View>
                </Modal>
            */}
        </View>
    );
}

export const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    memberItem: {
        marginBottom: 10,
    },
    memberText: {
        fontSize: 16,
    },
});



