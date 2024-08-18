import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { accountStyles } from '../accountStyles';
import { FormAccountExpanded } from './FormAccountExpanded';
import { FormAccountHeader } from './FormAccountHeader';
import { AccountEntity } from '../../../entity/AccountEntity';

export const FormAccount = ({ accountData, expand: expandInit }) => {
    const [expand, setExpand] = useState(expandInit || false);

    return (
        <TouchableOpacity onPress={() => setExpand(!expand)}>
            <Card style={accountStyles.card}>
                <FormAccountHeader accountData={accountData} expand={expand} />
                {expand && <FormAccountExpanded accountData={accountData} setExpand={setExpand} />}
            </Card>
        </TouchableOpacity>
    );
};

