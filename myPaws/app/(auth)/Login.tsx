import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { handleLogin } from "../../auth/authService";

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const onLoginPress = async () => {
        try {
            setLoading(true);

            await handleLogin(email, password);

            router.replace("/(tabs)/home");
        } catch (error: any) {
            let message = "Login failed.";

            if (error.message === "Missing credentials") {
                message = "Please enter email and password.";
            } else if (error.code === "auth/invalid-credential") {
                message = "Invalid email or password.";
            }

            Alert.alert("Error", message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>

                    <Image
                        source={require("../../assets/images/paws_logo.png")}
                        style={{ width: 150, height: 150, alignSelf: 'center' }}
                    />
                    <Text style={styles.title}>
                        MY PAWS
                    </Text>
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#999"
                        style={styles.input}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#999"
                        style={styles.input}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <Pressable
                        style={[styles.button, loading && { opacity: 0.7 }]}
                        onPress={onLoginPress}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Log in</Text>
                        )}
                    </Pressable>

                    <View
                        style={{
                            height: 1,
                            backgroundColor: "#e5e7eb",
                            marginVertical: 16,
                        }}
                    />

                    <Pressable onPress={() => router.replace('/(auth)/SignUp')}>
                        <Text style={styles.link}>Create an account</Text>
                    </Pressable>

                    <Pressable style={styles.bottomContainer} onPress={() => router.push('/BottomInfo')}>
                        <Text style={styles.bottomLinks}>
                            PRIVACY POLICY
                        </Text>
                        <Text style={styles.bottomLinks}>
                            JOIN US
                        </Text>
                        <Text style={styles.bottomLinks}>
                            INFORMATION
                        </Text>
                    </Pressable>


                </View>
            </ScrollView>
        </KeyboardAvoidingView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        padding: 24,
    },
    title: {
        fontSize: 35,
        fontWeight: "700",
        color: "black",
        marginBottom: 32,
        textAlign: "center",
    },
    input: {
        backgroundColor: "#F2F2F2",
        color: "black",
        padding: 14,
        borderRadius: 10,
        marginBottom: 16,
        fontSize: 16,
        borderWidth: 2,
        borderColor: '#7ED957'
    },
    button: {
        backgroundColor: "#7ED957",
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 8,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "700",
    },
    link: {
        color: "#58963E",
        marginTop: 16,
        textAlign: "center",
        fontSize: 18
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexDirection: 'row',
        gap: 20,
    },
    bottomLinks: {
        color: '#58963E',
        marginBottom: 30,
        textDecorationLine: "underline",
    }
});
