import { useState } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { Calendar } from 'react-native-big-calendar'
import IconButton from "../components/IconButton";
import { generateWeekSlots } from "../../utils/generateEvents";
import { Ionicons } from "@expo/vector-icons";

const DATA = [
    {
        id: 'random_id1',
        time: "09:00",
        disabled: false
    },
    {
        id: 'random_id2',
        time: "09:30",
        disabled: false
    },
    {
        id: 'random_id3',
        time: "10:00",
        disabled: false
    },
    {
        id: 'random_id4',
        time: "10:30",
        disabled: true
    },
    {
        id: 'random_id5',
        time: "11:00",
        disabled: true
    },
    {
        id: 'random_id6',
        time: "11:30",
        disabled: true
    },
    {
        id: 'random_id7',
        time: "12:00",
        disabled: false
    },
    {
        id: 'random_id8',
        time: "12:30",
        disabled: false
    },
    {
        id: 'random_id9',
        time: "13:00",
        disabled: true
    },
    {
        id: 'random_id10',
        time: "13:30",
        disabled: false
    },
    {
        id: 'random_id11',
        time: "14:00",
        disabled: false
    },
    {
        id: 'random_id12',
        time: "14:30",
        disabled: true
    },
    {
        id: 'random_id13',
        time: "15:00",
        disabled: false
    },
    {
        id: 'random_id14',
        time: "15:30",
        disabled: false
    },
    {
        id: 'random_id15',
        time: "16:00",
        disabled: true
    },
    {
        id: 'random_id16',
        time: "16:30",
        disabled: false
    },
    {
        id: 'random_id17',
        time: "17:00",
        disabled: false
    },
    {
        id: 'random_id18',
        time: "17:30",
        disabled: true
    },
    {
        id: 'random_id19',
        time: "18:00",
        disabled: false
    },
    {
        id: 'random_id20',
        time: "18:30",
        disabled: false
    }
];

export default function MyCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [dayOpen, setDayOpen] = useState(false)
    const [timeOpen, setTimeOpen] = useState('null')

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
                <View style={styles.day_container}>
                    <View style={styles.day_container_header}>
                        <Text style={styles.inner_title}>
                            {selectedDate && capitalize(formatSpanishDay(selectedDate))}
                        </Text>
                        <Pressable onPress={() => setDayOpen(false)}>
                            <Ionicons name={"close"} size={30} color="black" />
                        </Pressable>

                    </View>
                    <FlatList
                        data={DATA}
                        renderItem={({ item }) =>
                            <Pressable style={item.disabled ? styles.item_container_disabled : styles.item_container}
                                onPress={() => { if (!item.disabled) {console.log(item.id, item.time); setTimeOpen(item.time)} }}>
                                <Text style={styles.item_text}>{item.time}
                                </Text>
                            </Pressable>}>
                    </FlatList>
                </View>
            )}
            {timeOpen !== 'null' && (<View style={{ width: '95%',
                height: '50%', display: 'flex', position: 'absolute',
                zIndex: 2, backgroundColor: 'white', top: 100, boxShadow: '1px 1px 8px gray', alignSelf: 'center' }}></View>)}
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
        fontWeight: 400
    },
    item_container: {
        backgroundColor: '#6bb84b',
        padding: 6,
        margin: 2,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'black'
    },
    item_container_disabled: {
        backgroundColor: '#888888',
        padding: 6,
        margin: 2,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#636262'
    },
    item_text: {
        marginLeft: 2,
        fontSize: 16,
        color: 'white',
        fontWeight: 500
    },
    day_container: {
        padding: 10,
        position: "absolute",
        height: "100%",
        width: "85%",
        backgroundColor: "white",
        zIndex: 1,
        borderRadius: 4,
        boxShadow: '1px 1px 8px gray',
        alignSelf: 'center'
    },
    day_container_header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    nav_buttons: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        backgroundColor: '#5C9E3F'
    }
})