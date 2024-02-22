import React from 'react';
import { View, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export function DatePikerMobile({ name, setShowDatePicker, handleInputChange, showDatePicker }) {

    return (
        <View>
            {showDatePicker && Platform.OS !== 'web' && <DateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                    setShowDatePicker(false); // Esconda após seleção
                    if (selectedDate) handleInputChange(name, selectedDate);
                }} />}
        </View>);
}
