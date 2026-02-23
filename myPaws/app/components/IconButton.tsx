import { Text, Pressable, StyleSheet, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IconButtonProps = {
    text: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: (event: GestureResponderEvent) => void;
    direction: string
};

export default function IconButton({ text, icon, onPress, direction }: IconButtonProps) {
    return (
        <Pressable style={[styles.button, { flexDirection: direction === 'right' ? 'row-reverse' : 'row' }]}
            onPress={onPress}>
            <Ionicons name={icon} size={20} color="#fff" />
            <Text style={styles.text}>{text}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#5C9E3F',
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    text: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 17
    },
});
