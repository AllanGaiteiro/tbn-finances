import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { titleStyles } from "./titleStyles";

export function TransactionCardCalendarTitle() {
    return <View style={titleStyles.sectionHeader}>
        <Ionicons name="calendar-outline" size={24} color="#333" style={titleStyles.icon} />
        <Text style={titleStyles.title}>Balanço por Mês</Text>
    </View>;
}