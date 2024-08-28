import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { titleStyles } from "./titleStyles";

export function TransactionListTitle() {
    return <View style={titleStyles.sectionHeader}>
        <Ionicons name="list-outline" size={24} color="#333" style={titleStyles.icon} />
        <Text style={titleStyles.title}>Transações</Text>
    </View>;
}