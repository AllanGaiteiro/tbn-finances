import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import ImageFullScreenView from '../ImageFullScreenView';
import InputImageGallery from './InputImageGalery';
import InputImageCam from './InputImageCam';

export function ExpenseInputImage({ expense }) {
    const [image, setImage] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Foto do Recibo</Text>
            <Text style={styles.description}>Adicione uma foto do recibo para documentar sua despesa.</Text>
            <View style={styles.buttonsContainer}>
                <InputImageGallery setImage={setImage} />
                <InputImageCam setImage={setImage} />
            </View>

            {image &&
                <View>
                    <TouchableOpacity onPress={() => setIsVisible(true)}>
                        <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
                    </TouchableOpacity>
                    <ImageFullScreenView
                        imageUrl={image}
                        isVisible={isVisible}
                        onClose={() => setIsVisible(false)}
                    />
                </View>

            }

        </View>
    );
}

export const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    description: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginVertical: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    imagePreviewContainer: {
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginTop: 20,
    },
    image: {
        width: 300,
        height: 200,
        borderRadius: 8,
    },
});



