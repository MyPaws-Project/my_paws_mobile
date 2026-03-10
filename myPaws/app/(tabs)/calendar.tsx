import { useState } from "react";
import { Platform, ScrollView } from "react-native";
import { View, Text, Pressable, FlatList, StyleSheet, KeyboardAvoidingView, TextInput, Image } from "react-native";
import { Calendar } from 'react-native-big-calendar';
import IconButton from "../components/IconButton";
import { availableSlots } from "../../utils/generateSlots"
import { Ionicons } from "@expo/vector-icons";
import { useClient } from "../../context/ClientContext";

export default function MyCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [dayOpen, setDayOpen] = useState(false)
    const [timeOpen, setTimeOpen] = useState<string | null>(null);
    const { client } = useClient()

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

    const formatSpanishDay = (date: Date) =>
        new Intl.DateTimeFormat("es-UY", {
            weekday: "long",
            day: "numeric",
        }).format(date);

    const capitalize = (text: string) =>
        text.charAt(0).toUpperCase() + text.slice(1);

    return (
        <View style={{ height: "100%", backgroundColor: 'white', display: "flex" }}>
            {dayOpen && (
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.day_container}>
                    <View style={styles.day_container_header}>
                        <Text style={styles.inner_title}>
                            Select Time
                        </Text>
                        <Pressable onPress={() => setDayOpen(false)}>
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
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: 10, gap: 5, borderRadius: 10, borderWidth: 2, borderColor: '#7ED957', paddingLeft: 5 }}>
                                    <Ionicons name="time-outline" size={30} color={'#5C9E3F'} />
                                    <Text style={{ fontSize: 16, marginLeft: 10, marginRight: 20 }}>{timeOpen}</Text>
                                </View>
                                <Pressable style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: 10, gap: 5, borderRadius: 10, borderWidth: 2, borderColor: '#7ED957', paddingLeft: 10, paddingRight: 5 }}>
                                    <Image source={require('../../assets/images/paw_green.png')} style={{ width: 22, height: 22 }} />
                                    <Text style={{ fontSize: 16 }}>Select a pet</Text>
                                    <Ionicons name="chevron-down" color={'#000'} size={20} />
                                </Pressable>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '94%', margin: 10, marginTop: 0, gap: 5, borderRadius: 10, borderWidth: 2, borderColor: '#7ED957', padding: 5, paddingLeft: 5 }}>
                                <View style={{ display: 'flex', flexDirection: 'row', alignSelf: "flex-start", alignItems: 'center' }}>
                                    <Ionicons name="document-text-outline" size={24} color="#5C9E3F" />
                                    <Text style={{ fontSize: 16, marginLeft: 5 }}>Reason</Text>
                                </View>
                                <TextInput style={{ width: '96%', backgroundColor: '#f5f5f5', margin: 5, borderRadius: 10, borderWidth: 2, borderColor: '#7ED957' }}></TextInput>
                            </View>
                            <View style={{ width: '50%', display: 'flex', flexDirection: 'row-reverse', alignSelf: 'flex-end', gap: 5, margin: 5, padding: 5 }}>
                                <Pressable style={{ width: 40, height: 40, backgroundColor: 'red', borderRadius: 10 }}
                                    onPress={() => { setTimeOpen(null); setDayOpen(false) }}>
                                    <Ionicons name="close" size={40} color={'#FFF'} />
                                </Pressable>
                                <Pressable style={{ width: 40, height: 40, backgroundColor: 'green', borderRadius: 10 }}>
                                    <Ionicons name="checkmark" size={40} color={'#FFF'} />
                                </Pressable>
                            </View>
                        </View>
                    )}
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
        marginTop: 25,
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
    }
})