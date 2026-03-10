import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getAppointments, Appointment } from "../../utils/getAppointmentsForHome";
import { useClient } from "../../context/ClientContext";
import { useClientPets } from "../../hooks/useClientPets";
import { registerRefresh } from "../../hooks/useRefresh";

export default function Home() {
  const { client } = useClient();
  const { pets } = useClientPets(client?.uid);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  function getPetName(petId: string) {
    if (!pets) return "Loading pet...";
    const pet = pets.find((p) => p.id === petId);
    return pet ? pet.name : "Unknown pet";
  }

  const loadAppointments = async () => {
    if (!client) return;

    const data = await getAppointments(client.uid);
    setAppointments(data);
    setLoading(false);
  };

  const upcomingAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.startTime.seconds * 1000);
    return appointmentDate >= new Date();
  });

  useEffect(() => {
    loadAppointments();
  }, [client]);

  useEffect(() => {
    registerRefresh(loadAppointments);
  }, [client]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading appointments...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Appointments</Text>

      <FlatList
        data={upcomingAppointments}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>No appointments scheduled</Text>
        }
        renderItem={({ item }) => {
          const date = new Date(item.startTime.seconds * 1000);

          return (
            <View style={styles.card}>
              <Text style={styles.petName}>
                🐾 {getPetName(item.petId)}
              </Text>

              <Text style={styles.date}>
                {date.toLocaleDateString()}{" "}
                {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>

              <Text style={styles.reason}>{item.reason}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#7ED957",
  },

  date: {
    fontSize: 16,
    fontWeight: "600",
  },

  reason: {
    marginTop: 5,
    fontSize: 15,
    color: "#444",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "gray",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  petName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 3
  },
});