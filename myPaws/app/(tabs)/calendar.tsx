import { useState, useEffect } from "react";
import { ScrollView, View, Text, Pressable, FlatList, StyleSheet, KeyboardAvoidingView, TextInput, Image, Platform } from "react-native";
import { Calendar } from 'react-native-big-calendar';
import IconButton from "../components/IconButton";
import { getAvailableSlots } from "../../utils/generateSlots"
import { Ionicons } from "@expo/vector-icons";
import { useClient } from "../../context/ClientContext";
import { useClientPets } from "../../hooks/useClientPets";
import type { Pet } from "../../hooks/useClientPets";
import { scheduleAppointment } from "../../utils/scheduleAppointment";

export default function MyCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [dayOpen, setDayOpen] = useState(false)
    const [timeOpen, setTimeOpen] = useState<string | null>(null);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [petDropdownOpen, setPetDropdownOpen] = useState(false);
    const [reason, setReason] = useState("");
    const { client } = useClient()
    const { pets } = useClientPets(client?.uid);
    const [availableSlots, setAvailableSlots] = useState<{ id: number; time: string }[]>([]);

    useEffect(() => {
        if (!selectedDate) return;

        const loadSlots = async () => {
            const slots = await getAvailableSlots(selectedDate);
            setAvailableSlots(slots);
        };

        loadSlots();
    }, [selectedDate]);

    const goNextMonth = () => {
        const d = new Date(currentDate);
        d.setMonth(d.getMonth() + 1);
        setCurrentDate(d);
    };

    const goPrevMonth = () => {
        const d = new Date(currentDate);
        d.setMonth(d.getMonth() - 1);
        setCurrentDate(d);
    };

    return (
        <View style={{ height: "100%", backgroundColor: 'white', display: "flex" }}>
            {dayOpen && (
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.day_container}>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}>
                        <View style={styles.day_container_header}>
                            <Text style={styles.inner_title}>
                                Select Time
                            </Text>
                            <Pressable onPress={() => { setDayOpen(false); setTimeOpen(null); setSelectedPet(null) }}>
                                <Ionicons name={"close"} size={30} color="black" />
                            </Pressable>

                        </View>
                        <FlatList
                            data={availableSlots}
                            numColumns={2}
                            keyExtractor={(item) => item.id.toString()}
                            columnWrapperStyle={{ justifyContent: "space-around" }}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={[
                                        styles.item_container,
                                        timeOpen === item.time && styles.item_container_active
                                    ]}
                                    onPress={() => {
                                        console.log(item.id, item.time);
                                        setTimeOpen(timeOpen === item.time ? null : item.time);
                                    }}
                                >
                                    <Text style={styles.item_text}>{item.time}</Text>
                                </Pressable>
                            )}
                        />
                        {timeOpen != null && (
                            <View style={{ borderWidth: 2, borderColor: '#7ED957', margin: 10, borderRadius: 15 }}>
                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>

                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '35%', margin: 10, gap: 5, borderRadius: 10, borderWidth: 2, borderColor: '#7ED957', paddingLeft: 5 }}>
                                        <Ionicons name="time-outline" size={30} color={'#5C9E3F'} />
                                        <Text style={{ fontSize: 16, marginLeft: 10, marginRight: 20 }}>{timeOpen}</Text>
                                    </View>

                                    <Pressable style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '50%', margin: 10, gap: 5, borderRadius: 10, borderBottomLeftRadius: petDropdownOpen ? 0 : 10, borderBottomRightRadius: petDropdownOpen ? 0 : 10, borderWidth: 2, borderColor: '#7ED957', paddingLeft: 10, paddingRight: 5 }}
                                        onPress={() => setPetDropdownOpen(!petDropdownOpen)}>
                                        <Image source={require('../../assets/images/paw_green.png')} style={{ width: 22, height: 22 }} />
                                        <Text style={{ fontSize: 16 }}>{selectedPet !== null ? `${selectedPet.name}` : "Select a pet"}</Text>
                                        <Ionicons name={petDropdownOpen ? "chevron-up" : "chevron-down"} color={'#000'} size={20} />
                                    </Pressable>

                                    {petDropdownOpen && (
                                        <View
                                            style={{
                                                position: "absolute",
                                                top: 42,
                                                right: 11,
                                                width: 154,
                                                backgroundColor: "white",
                                                borderRadius: 10,
                                                borderTopLeftRadius: petDropdownOpen ? 0 : 10,
                                                borderTopRightRadius: petDropdownOpen ? 0 : 10,
                                                borderWidth: 2,
                                                borderColor: "#7ED957",
                                                zIndex: 5,
                                            }}>
                                            {pets?.map((pet) => (
                                                <Pressable
                                                    key={pet.id}
                                                    style={{
                                                        padding: 10,
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: "#eee"
                                                    }}
                                                    onPress={() => {
                                                        setSelectedPet(pet);
                                                        setPetDropdownOpen(false);
                                                    }}
                                                >
                                                    <Text style={{ color: 'black', fontSize: 16, textAlign: 'center' }}>{pet.name}</Text>
                                                </Pressable>
                                            ))}
                                        </View>
                                    )}
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '94%', margin: 10, marginTop: 0, gap: 5, borderRadius: 10, borderWidth: 2, borderColor: '#7ED957', padding: 5, paddingLeft: 5 }}>
                                    <View style={{ display: 'flex', flexDirection: 'row', alignSelf: "flex-start", alignItems: 'center' }}>
                                        <Ionicons name="document-text-outline" size={24} color="#5C9E3F" />
                                        <Text style={{ fontSize: 16, marginLeft: 5 }}>Reason</Text>
                                    </View>
                                    <TextInput
                                        value={reason}
                                        onChangeText={setReason}
                                        style={{ width: '96%', backgroundColor: '#f5f5f5', margin: 5, borderRadius: 10, borderWidth: 2, borderColor: '#7ED957' }}></TextInput>
                                </View>
                                <Pressable style={styles.button}
                                    onPress={async () => {
                                        if (!selectedPet || !timeOpen || !selectedDate || !client) {
                                            console.log("Missing data");
                                            return;
                                        }

                                        try {
                                            await scheduleAppointment({
                                                selectedDate,
                                                time: timeOpen,
                                                petId: selectedPet.id,
                                                clientId: client.uid,
                                                clinicId: client?.clinicId ?? undefined,
                                                reason,
                                            });

                                            console.log("Appointment scheduled");

                                            setDayOpen(false);
                                            setTimeOpen(null);
                                            setSelectedPet(null);
                                            setReason("");
                                        } catch (error) {
                                            console.error("Error scheduling appointment", error);
                                        }
                                    }}>
                                    <Text style={styles.buttonText}>Schedule appointment</Text>
                                </Pressable>
                            </View>
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>
            )}
            <View style={styles.nav_buttons}>
                <IconButton text="Previous Month" icon="chevron-back" onPress={goPrevMonth} direction={"left"} />
                <IconButton text="Next Month" icon="chevron-forward" onPress={goNextMonth} direction={"right"} />
            </View>

            <Text style={styles.title}>
                {currentDate.toLocaleDateString("esp-US", {
                    month: "long",
                    year: "numeric",
                })}
            </Text>
            <Calendar
                events={[]}
                height={500}
                mode="month"
                date={currentDate}
                minHour={9}
                maxHour={19}
                onPressCell={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const pressed = new Date(date);
                    pressed.setHours(0, 0, 0, 0);

                    if (pressed < today) {
                        console.log("select a valid day");
                        return;
                    }

                    setSelectedDate(date);
                    setDayOpen(true);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "400",
        margin: 10
    },
    inner_title: {
        fontSize: 20,
        fontWeight: 400,
        color: 'dark-gray'
    },
    item_container: {
        backgroundColor: '#F5F5F5',
        padding: 6,
        margin: 3,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#7ED957',
        width: '45%',
    },
    item_container_active: {
        backgroundColor: '#7ED957',
        padding: 6,
        margin: 3,
        borderRadius: 15,
        width: '45%',
    },
    item_text: {
        fontSize: 16,
        color: 'dark-gray',
        fontWeight: 400,
        textAlign: 'center'
    },
    day_container: {
        marginTop: 0,
        padding: 10,
        position: "absolute",
        height: "auto",
        width: "85%",
        backgroundColor: "white",
        zIndex: 1,
        borderRadius: 15,
        boxShadow: '1px 1px 8px gray',
        alignSelf: 'center',
        display: 'flex',
    },
    day_container_header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10,
        marginTop: 0
    },
    nav_buttons: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        backgroundColor: '#5C9E3F'
    },
    button: {
        backgroundColor: "#7ED957",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        boxShadow: '1px 1px 2px gray',
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "700",
    },
})