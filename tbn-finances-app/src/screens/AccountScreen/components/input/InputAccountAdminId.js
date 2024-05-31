import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Modal, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { accountStyles } from '../../accountStyles';
import { useUser } from '../../../../providers/UserProvider';
import { AccountAddUser } from '../AccountAddUser';
import { MemberBalloon } from '../MemberBalloon';
import { userService } from '../../../../services/UserService';

export function InputAccountAdminId({ accountData, setAccountData }) {
    const { user } = useUser();
    const [adminName, setAdminName] = useState(user.uid === accountData.adminId ? user.name : null);
    const [isModalVisible, setIsModalVisible] = useState(false); // Estado do modal de seleção de administrador
    const [userMembars, setUserMembars] = useState([])
    useEffect(() => {
        // Verificar se há um admin ID e carregar o nome do admin
        if (accountData?.adminId) {
            fetchAdminName(accountData.adminId);
        }

        if (accountData?.members?.length) {
            fetchMenbers(accountData.members);
        }
    }, [accountData]);

    // Função para buscar o nome do administrador com base no ID
    const fetchMenbers = async (members) => {
        try {
            const users = (await userService.repository.getUsersByUids(members))
            setUserMembars(users)
        } catch (error) {
            console.error('Erro ao buscar o nome dos membros:', error);
        }
    };

    const fetchAdminName = async (adminId) => {
        try {
            if (user.uid === adminId) {
                setAdminName(user.name)
            } else {
                const userAdmin = await userService.repository.getUserById(adminId)
                setAdminName(userAdmin.displayName)
            }
        } catch (error) {
            console.error('Erro ao buscar o nome do administrador:', error);
        }
    };

    // Função para abrir o modal de seleção de administrador
    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    // Função para selecionar um novo administrador
    const handleSelectAdmin = (adminId) => {
        setAccountData({ ...accountData, adminId });
        setIsModalVisible(false);
    };

    return accountData?.id ? (
        <View>
            <View style={accountStyles.editButtonContainer}>
                <View>
                    <Text style={accountStyles.label}>Usuário Responsável</Text>
                    <MemberBalloon collor={'rgba(144, 238, 144, 0.2)'} member={accountData?.adminId === user.uid ? user.displayName : adminName || 'Não Tem Admin'} />
                </View>
                <AccountAddUser handleOpenModal={handleOpenModal} />
            </View>

            {userMembars.length > 0 && <Modal visible={isModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <FlatList
                        data={userMembars}
                        renderItem={({ item }) =>
                            item ? (
                                <TouchableOpacity onPress={() => handleSelectAdmin(item.uid)} style={styles.memberItem}>
                                    <Text style={styles.memberText}>{item.displayName || item.email}</Text>
                                </TouchableOpacity>
                            ) : null
                        }
                        keyExtractor={(item) => item.uid}
                    />
                    <Button title="Fechar" onPress={() => setIsModalVisible(false)} />
                </View>
            </Modal>}
        </View>
    ) : null;
}

const styles = StyleSheet.create({
    editButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        alignSelf: 'flex-end',
    },
    editButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    adminText: {
        marginBottom: 10,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    memberItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
    },
    memberText: {
        fontSize: 16,
    },
});
