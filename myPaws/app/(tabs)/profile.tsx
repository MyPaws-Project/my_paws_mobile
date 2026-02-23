import { Ionicons } from "@expo/vector-icons";
import { Text, View, Image, Pressable, ActivityIndicator, StyleSheet, TextInput, KeyboardAvoidingView } from "react-native";
import { useClient } from "../../context/ClientContext";
import { pickImageFromLibrary, uploadImageToCloudinary } from "../../utils/imagePicker";
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../auth/firebase";
import { useClinics } from "../../hooks/useClinics";

export default function Profile() {

  const { client, setClient } = useClient();
  const { clinics, loading: clinicsLoading } = useClinics();

  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    notes: "",
    clinicId: "",
  });

  const clinicName =
    clinics.find(c => c.id === client?.clinicId)?.name ?? "—";

  const handleEditOpen = () => {
    setEditOpen(v => !v)
  }

  const handleSave = async () => {
    if (!client?.uid) return;

    try {
      setUploading(true);

      const ref = doc(db, "clients", client.uid);

      await updateDoc(ref, {
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        notes: form.notes,
        clinicId: form.clinicId,
        photoURL: image ?? null,
      });
      setClient({
        ...client,
        ...form,
        photoURL: image ?? client.photoURL,
      });
      setEditOpen(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!client) return;

    setForm({
      fullName: client.fullName ?? "",
      phone: client.phone ?? "",
      address: client.address ?? "",
      notes: client.notes ?? "",
      clinicId: client.clinicId ?? "",
    });
  }, [client]);

  useEffect(() => {
    const loadPhoto = async () => {
      if (!client?.uid) return;

      try {
        const clientRef = doc(db, "clients", client.uid);
        const clientSnap = await getDoc(clientRef);
        if (clientSnap.exists()) {
          const data = clientSnap.data();
          if (data.photoURL) setImage(data.photoURL);
        }
      } catch (err) {
        console.log("Failed to load client photo:", err);
      }
    };

    loadPhoto();
  }, [client?.uid]);

  const handlePickImage = async () => {
    const localUri = await pickImageFromLibrary();
    if (!localUri || !client?.uid) return;

    setUploading(true);
    const uploadedUrl = await uploadImageToCloudinary(localUri, client.uid);
    if (uploadedUrl) setImage(uploadedUrl);
    setUploading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.screen}>
      <View style={styles.green_container}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/paw_white_two.png')}
            style={{ height: 33, width: 46 }}
          />
          {!editOpen && (<Text style={styles.title}>{client?.fullName}</Text>)}
          {editOpen && (<TextInput
            value={form.fullName}
            onChangeText={(v) => setForm({ ...form, fullName: v })}
            style={styles.edit_title}
          />)}
          <Pressable onPress={() => { handleEditOpen(); console.log(editOpen) }}>
            <Ionicons name="build-sharp" size={30} color={'#FFF'} />
          </Pressable>

        </View>
        <View style={styles.white_container}>
          <Pressable style={{}} onPress={() => handlePickImage()}>
            <Image source={require('../../assets/images/dots.png')}
              style={styles.dots} />
            {uploading && <ActivityIndicator size="large" color="#5C9E3F" style={styles.loader} />}
            <Image
              source={image ? { uri: image } : require('../../assets/images/placeholder-empty.png')}
              style={styles.image}
            />
          </Pressable>
          <View style={styles.hr}></View>
          {editOpen && (<View style={styles.text_view}>
            <Text style={{ ...styles.text, backgroundColor: '#EFEFEF', borderColor: 'black' }}>Email: {client?.email}</Text>
            <TextInput
              style={styles.text}
              placeholder="Phone"
              value={form.phone}
              onChangeText={(v) => setForm({ ...form, phone: v })}
            />

            <TextInput
              style={styles.text}
              placeholder="Address"
              value={form.address}
              onChangeText={(v) => setForm({ ...form, address: v })}
            />

            <TextInput
              multiline
              textAlignVertical="top"
              style={styles.notes}
              placeholder="Notes"
              value={form.notes}
              onChangeText={(v) => setForm({ ...form, notes: v })}
            />
            <Picker
              selectedValue={form.clinicId}
              onValueChange={(v) => setForm({ ...form, clinicId: v })}
              style={styles.text}
            >
              <Picker.Item label="Select a clinic" value={null} />

              {clinics.map(c => (
                <Picker.Item key={c.id} label={c.name} value={c.id} />
              ))}
            </Picker>
            <Pressable
              style={[styles.button, uploading && { opacity: 0.7 }]}
              disabled={uploading}
              onPress={handleSave}
            >
              {uploading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Save</Text>
              )}
            </Pressable>
          </View>)}
          {!editOpen && <View style={styles.text_view}>
            <Text style={styles.text}>Email: {client?.email}</Text>
            <Text style={styles.text}>Phone: {client?.phone}</Text>
            <Text style={styles.text}>Adress: {client?.address}</Text>
            <Text style={styles.notes}>Notes: {client?.notes}</Text>
            <Text style={styles.text}>Clinic: {clinicName}</Text>
          </View>}
        </View>
      </View>
    </KeyboardAvoidingView>);
}

const styles = StyleSheet.create({
  text: {
    fontSize: 17,
    width: '100%',
    backgroundColor: '#d9f1c3',
    padding: 4,
    paddingLeft: 15,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#5C9E3F',
    boxShadow: '1px 1px 2px gray'
  },
  notes: {
    flexShrink: 1,
    flexWrap: 'wrap',
    fontSize: 17,
    width: '100%',
    backgroundColor: '#d9f1c3',
    padding: 4,
    paddingLeft: 15,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#5C9E3F',
    boxShadow: '1px 1px 2px gray',
    minHeight: 75
  },
  text_view: {
    flex: 1,
    gap: 7
  },
  hr: {
    margin: 8,
    width: '95%',
    height: 1,
    backgroundColor: 'gray'
  },
  dots: {
    width: 30,
    height: 12,
    position: "absolute",
    top: 128,
    right: 12,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 4
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    boxShadow: '1px 1px 8px gray'
  },
  loader: {
    position: 'absolute',
    top: 60,
    left: '45%',
    zIndex: 2
  },
  white_container: {
    backgroundColor: 'white',
    marginTop: 10,
    height: '89%',
    width: '96%',
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'column',
    gap: 10,
    padding: 10
  },
  title: {
    fontSize: 24,
    color: 'white',
    padding: 5,
  },
  edit_title: {
    fontSize: 24,
    backgroundColor: '#d9f1c3',
    padding: 5,
    borderWidth: 1,
    borderColor: '#5C9E3F',
    boxShadow: '1px 1px 2px gray',
    borderRadius: 4
  },
  header: {
    backgroundColor: '#5C9E3F',
    height: '8%',
    width: '100%',
    borderRadius: 4,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  green_container: {
    width: '95%',
    height: '100%',
    backgroundColor: '#C9E7AE',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center'
  },
  screen: {
    backgroundColor: 'white',
    borderRadius: 4,
    height: '97%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginTop: 10
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 30,
  },
  button: {
    backgroundColor: "#7ED957",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    boxShadow: '1px 1px 2px gray'
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

})
