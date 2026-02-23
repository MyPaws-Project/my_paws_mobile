import { useState } from "react";
import {
    View, Text, TextInput, Pressable, StyleSheet, Image, KeyboardAvoidingView, ScrollView, Platform, Alert, ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../auth/firebase";
import { ensureClientExists } from "../../auth/clientService";

export default function SignUp() {
    const router = useRouter();

    // 1. Add state for all inputs
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // 2. The SignUp Logic
    const handleSignUp = async () => {
        // Basic Validation
        if (!email || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "Password should be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            const cred = await createUserWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );

            // 🐶 Create client profile immediately
            await ensureClientExists(cred.user);

            router.replace("/(tabs)/home");
        } catch (error: any) {
            console.log(error.code);
            let message = "Could not create account.";

            if (error.code === 'auth/email-already-in-use') {
                message = "That email is already registered.";
            } else if (error.code === 'auth/invalid-email') {
                message = "Please enter a valid email address.";
            }

            Alert.alert("Sign Up Failed", message);
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
                    <Text style={styles.title}>MY PAWS</Text>

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

                    <TextInput
                        placeholder="Confirm Password"
                        placeholderTextColor="#999"
                        style={styles.input}
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />

                    <Pressable
                        style={[styles.button, loading && { opacity: 0.7 }]}
                        onPress={handleSignUp}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Sign up</Text>
                        )}
                    </Pressable>

                    <View style={styles.divider} />

                    <Pressable onPress={() => router.push("/(auth)/Login")}>
                        <Text style={styles.link}>Already have an account? Log In</Text>
                    </Pressable>

                    <View style={styles.bottomContainer}>
                        <Pressable onPress={() => router.push('/BottomInfo')}>
                            <Text style={styles.bottomLinks}>PRIVACY POLICY</Text>
                        </Pressable>
                        <Pressable onPress={() => router.push('/BottomInfo')}>
                            <Text style={styles.bottomLinks}>JOIN US</Text>
                        </Pressable>
                        <Pressable onPress={() => router.push('/BottomInfo')}>
                            <Text style={styles.bottomLinks}>INFORMATION</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "white", justifyContent: "center", padding: 24 },
    title: { fontSize: 35, fontWeight: "700", color: "black", marginBottom: 32, textAlign: "center" },
    input: { backgroundColor: "#F2F2F2", color: "black", padding: 14, borderRadius: 10, marginBottom: 16, fontSize: 16, borderWidth: 2, borderColor: '#7ED957' },
    button: { backgroundColor: "#7ED957", padding: 16, borderRadius: 10, alignItems: "center", marginTop: 8 },
    buttonText: { color: "white", fontSize: 18, fontWeight: "700" },
    divider: { height: 1, backgroundColor: "#e5e7eb", marginVertical: 16 },
    link: { color: "#58963E", marginTop: 16, textAlign: "center", fontSize: 18 },
    bottomContainer: { flex: 1, justifyContent: 'center', alignItems: 'flex-end', flexDirection: 'row', gap: 20 },
    bottomLinks: { color: '#58963E', marginBottom: 30, textDecorationLine: "underline" }
});