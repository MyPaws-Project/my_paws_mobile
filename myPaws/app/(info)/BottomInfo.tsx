import { ScrollView, Text } from "react-native"

export default function BottomInfo() {
    return (
        <ScrollView contentContainerStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            style={{ marginBottom: 50, padding: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 600 }}>
                About the App
            </Text>
            <Text>
                Our app is built for pet parents who want an easier way to care for the animals they love.
                From keeping important information organized to staying on top of everyday needs, we’re here to support you and your pets at every stage of life.
                We believe pets are family — and caring for them should be simple, stress-free, and accessible.
            </Text>
            <Text style={{ fontSize: 20, fontWeight: 600 }}>
                Pet & Owner Information
            </Text>
            <Text>
                To provide helpful features, we may collect and store information such as:
                -Pet details (name, species, breed, age, vaccinations, etc.)
                -Owner account information
                -App usage data to improve performance and features
                This information is used only to support app functionality and improve your experience.
            </Text>
            <Text style={{ fontSize: 20, fontWeight: 600 }}>
                Privacy Policy
            </Text>
            <Text>
                Your privacy — and your pet’s information — is important to us.
                We only collect data necessary for the app to work properly
                -Your information is never sold to third parties
                -Data is stored securely and accessed only when needed
                -You can update or delete your information at any time
                By using the app, you agree to the collection and use of information as described above.
            </Text>
            <Text>
                Some features may use location data (such as finding nearby clinics or services).
                Location access is optional and only used when you enable it.
                We never track you in the background without permission.
            </Text>
            <Text style={{ fontSize: 20, fontWeight: 600 }}>
                Community & Responsible Use
            </Text>
            <Text>
                We’re creating a safe and supportive space for pet owners.

                We ask users to:

                Provide accurate information

                Respect other users and professionals

                Use the app responsibly and lawfully

                We reserve the right to restrict access if these guidelines are violated.
            </Text>
            <Text style={{ fontSize: 20, fontWeight: 600 }}>
                Join the Pack
            </Text>
            <Text style={{marginBottom: 20}}>
                We’re growing — and we’d love for you and your pet to be part of it.
                By joining, you help shape the future of the app through feedback, feature ideas, and real-world use.
                Together, we can build a better experience for pets and the people who care for them.
            </Text>
        </ScrollView>
    )
}
