import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import { downloadImage } from "../../utils/downoadPermission";
import { useClientPets } from "../../hooks/useClientPets";
import { useClient } from "../../context/ClientContext";
import { pickImageFromLibrary, uploadPetImageToCloudinary } from "../../utils/petImagePicker";
import { calculatePetAge } from "../../utils/calculatePetAge";
import type { Pet, MedicalHistory, Photos } from "../../hooks/useClientPets";

const getTabs = (pet: Pet) => [
  { key: 'summary', label: 'Summary' },
  { key: 'consults', label: 'Consults', count: pet.medicalHistory?.length ?? 0 },
  { key: 'vaccines', label: 'Vaccines' },
  { key: 'records', label: 'Records' },
  { key: 'notes', label: 'Notes' },
];

export default function Files() {
  const [openPetId, setOpenPetId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [photoOpen, setPhotoOpen] = useState<Photos | null>(null)
  const [petImages, setPetImages] = useState<Record<string, string>>({});
  const { client } = useClient();
  const { pets, loading } = useClientPets(client?.uid);

  const handlePickImage = async (clientId?: string, petId?: string) => {
    if (!clientId || !petId) return;

    const uri = await pickImageFromLibrary();
    if (!uri) return;

    const uploadedUrl = await uploadPetImageToCloudinary(uri, clientId, petId);
    if (!uploadedUrl) return;

    // Update local state so UI refreshes immediately
    setPetImages(prev => ({
      ...prev,
      [petId]: uploadedUrl,
    }));
  };

  //console.log("PETS:", pets);
  return (
    <>
      {/* IMAGE VIEW */}

      {photoOpen && (
        <View style={{ backgroundColor: 'black', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Pressable style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', width: '100%', padding: 5 }}
            onPress={() => setPhotoOpen(null)}>
            <Text style={{ ...styles.title, color: 'white' }}>{photoOpen.title.toUpperCase()}</Text>
            <Ionicons name="close" color={'#fff'} size={30} />
          </Pressable>
          <Image source={{ uri: photoOpen.url }} style={{ width: '100%', height: '90%' }} resizeMode="contain" />
          <View style={{ alignSelf: 'flex-end', height: 40, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ ...styles.title, color: 'white', marginLeft: 5}}>{photoOpen.description}</Text>
            <Pressable onPress={() => { console.log('button press'); downloadImage(photoOpen.url) }}>
              <Image source={require('../../assets/images/download.png')} style={{ height: 25, width: 25, marginRight: 5 }} />
            </Pressable>
          </View>
        </View>)}
      <View style={{ backgroundColor: 'white', width: '100%', height: '100%', paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }}>
        {pets.map(pet => {
          const isOpen = openPetId === pet.id;
          const localImage = petImages[pet.id]; //for image instant reload
          return (
            <View key={pet.id} style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
              <Pressable onPress={() => setOpenPetId(isOpen ? null : pet.id)}>
                <View style={isOpen ? styles.pet_header_open : styles.pet_header_closed}>
                  <Image
                    source={require('../../assets/images/paw_white_two.png')}
                    style={{ height: 33, width: 46 }}
                  />
                  <Text style={{ fontSize: 24, color: 'white', fontWeight: '400' }}>
                    {pet.name}
                  </Text>
                  <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={30} color="#FFF" />
                </View>
              </Pressable>
              {isOpen && (
                <View style={{ height: '82%', backgroundColor: '#C9E7AE', padding: 10, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ width: '100%', height: '100%', borderRadius: 8, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <View style={{ height: '4%', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                      {getTabs(pet).map(tab => (
                        <Pressable key={tab.key} onPress={() => setActiveTab(tab.key)}>
                          <Text style={[styles.unactiveTab, activeTab === tab.key && styles.activeTab]}>
                            {tab.label}
                            {typeof tab.count === 'number' && ` (${tab.count})`}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                    <View style={{
                      backgroundColor: 'white',
                      width: '100%',
                      height: '95%',
                      borderBottomLeftRadius: 5,
                      borderBottomRightRadius: 5,
                      padding: 5,
                      display: 'flex',
                      alignItems: 'center'
                    }}>

                      {/* SUMMARY TAB */}

                      {activeTab === 'summary' && (
                        <View style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                          <View style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                            <Pressable onPress={() => { handlePickImage(client?.uid, pet.id) }}>
                              <Image source={require('../../assets/images/dots.png')}
                                style={{ width: 30, height: 12, position: "absolute", top: 128, left: 110, zIndex: 1, backgroundColor: 'white', borderRadius: 3 }} />
                              <Image
                                source={
                                  localImage
                                    ? { uri: localImage }
                                    : pet.photoUrl
                                      ? { uri: pet.photoUrl }
                                      : pet.species?.toLowerCase() === "gato"
                                        ? require("../../assets/images/placeholder-cat.png")
                                        : pet.species?.toLowerCase() === "perro"
                                          ? require("../../assets/images/placeholder-dog.png")
                                          : require("../../assets/images/placeholder-empty.png")
                                }
                                style={{ width: 150, height: 150, borderRadius: 8, boxShadow: '1px 1px 8px gray' }}
                              />
                            </Pressable>
                            <View style={{ marginLeft: 15, display: 'flex', justifyContent: 'space-around' }}>
                              <View><Text style={styles.title}>{pet.species}{' •  '}{pet.breed}</Text></View>
                              <View style={styles.summary_list_container}>
                                <Image
                                  source={
                                    pet.gender?.toLowerCase() === "female"
                                      ? require("../../assets/images/female.png")
                                      : require("../../assets/images/male.png")
                                  } style={{ width: 15, height: 15 }}
                                />
                                <Text style={{ fontSize: 16, margin: 5 }}>{' •  '}{pet.gender}</Text></View>
                              <View style={styles.summary_list_container}>
                                <Image source={require('../../assets/images/weight.png')} style={{ width: 15, height: 15 }} />
                                <Text style={{ fontSize: 16, margin: 5 }}>{' •  '}{pet.weight} Kg</Text></View>
                              <View style={styles.summary_list_container}>
                                <Image source={require('../../assets/images/cake.png')} style={{ width: 15, height: 15 }} />
                                <Text style={{ fontSize: 16, margin: 5 }}>{' •  '}{calculatePetAge(pet.birthDate)}</Text></View>
                            </View>
                          </View>
                          <View style={{ margin: 8, width: '95%', height: 1, backgroundColor: 'gray' }}></View>
                          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ display: 'flex', flexDirection: 'column', gap: 10, marginRight: 20 }}>
                              <View style={{ borderRadius: 5, backgroundColor: '#EE2623', minWidth: '160', padding: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20, justifyContent: 'flex-start', width: '100%', boxShadow: '1px 1px 8px gray' }}>
                                <Image source={require('../../assets/images/warning.png')} style={{ width: 22, height: 22, marginLeft: 5 }} />
                                <Text style={{ color: 'white', fontSize: 16, }}>{pet.allergies === 'none' ? 'No Allergies' : pet.allergies}</Text></View>
                              <View style={{ borderRadius: 5, backgroundColor: '#F19900', padding: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20, justifyContent: 'flex-start', width: '100%', marginRight: 15, boxShadow: '1px 1px 8px gray' }}>
                                <Image source={require('../../assets/images/warning.png')} style={{ width: 22, height: 22, marginLeft: 5 }} />
                                <Text style={{ color: 'white', fontSize: 16 }}>{pet.illnesses === 'none' ? 'No illnesses' : pet.illnesses}</Text></View>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                              <Text style={{ fontSize: 16, margin: 5 }}>{client?.fullName}</Text>
                              <View style={styles.summary_list_container}>
                                <Image source={require('../../assets/images/call.png')} style={{ width: 15, height: 15 }} />
                                <Text style={{ fontSize: 16, margin: 5 }}>{' •  '}{client?.phone}</Text>
                              </View>
                            </View>
                          </View>
                          <View style={{ margin: 8, width: '95%', height: 1, backgroundColor: 'gray' }}></View>
                          <View style={{ borderRadius: 5, backgroundColor: '#5EA6DA', padding: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxShadow: '1px 1px 8px gray' }}>
                            <Image source={require('../../assets/images/pills.png')} style={{ width: 25, height: 22, marginLeft: 20 }} />
                            <Text style={{ color: 'white', fontSize: 16 }}>{pet.medication === 'none' ? 'No Medications' : pet.medication}</Text>
                            <Ionicons name="chevron-down" color={'#FFF'} size={25} style={{ marginRight: 10 }} />
                          </View>
                          <View style={{ margin: 8, width: '95%', height: 1, backgroundColor: 'gray' }}></View>
                          <View style={{ display: "flex", justifyContent: 'center', alignItems: 'center', width: '100%', margin: 5, flexDirection: 'column' }}>
                            <Text style={styles.title}>Next Vaccines</Text>
                            <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                              {Object.entries(pet.vaccines ?? {}).map(([vaccineName, vaccine]) => (
                                <View key={vaccineName} style={{ display: 'flex', alignItems: 'center' }}>
                                  <Text style={{ fontSize: 16, margin: 5 }}>
                                    {vaccineName}
                                  </Text>
                                  <Image source={require('../../assets/images/tick.png')} style={{ width: 50, height: 50 }} />
                                  <Text>
                                    next in {Math.ceil(
                                      (new Date().getTime() - Date.now()) /
                                      (1000 * 60 * 60 * 24)
                                    )} days
                                  </Text>
                                </View>
                              ))}
                            </View>
                          </View>
                        </View>
                      )}

                      {/* CONSUlTS TAB */}

                      {activeTab === 'consults' && (
                        <View style={{ width: '100%', display: 'flex', flexDirection: 'column', padding: 5 }}>
                          {pet.medicalHistory?.map((history, index) =>
                            <View key={index} style={{ gap: 5, margin: 5, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                              <Image style={{ width: 36, height: 30 }} source={require('../../assets/images/heartbeat.png')} />
                              <View>
                                <Text style={{ fontSize: 18 }}>{history.type} - {history.attending_veterinarian}</Text>
                                <Text style={{ fontSize: 12 }}>{history.time_date}</Text>
                              </View>
                              <Pressable onPress={() => console.log('info press:', index)}>
                                <Ionicons name="information-circle-outline" size={30}></Ionicons>
                              </Pressable>
                            </View>)}
                        </View>
                      )}

                      {/* VACCINES TAB */}

                      {activeTab === 'vaccines' && (
                        <View style={{ padding: 5, marginTop: 10, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                          {Object.entries(pet.vaccines ?? {}).map(([vaccineName, vaccine]) => (
                            <View key={vaccineName} style={{ marginBottom: 20, display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'center' }}>
                              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Image source={require('../../assets/images/syringe.png')} style={{ width: 40, height: 40 }} />
                                <Text style={{ fontSize: 18, fontWeight: '600' }}>
                                  {vaccineName}
                                </Text>
                              </View>
                              <View>
                                {(vaccine.doses ?? []).map((dose) => (
                                  <Text key={dose} style={{ margin: 8 }}>
                                    • {dose}
                                  </Text>
                                ))}
                              </View>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* RECORDS TAB */}

                      {activeTab === 'records' && (
                        <View style={{ width: '100%', display: 'flex', flexDirection: 'column', padding: 5 }}>
                          {pet.photos?.map((photo) => (
                            <Pressable key={photo.title} onPress={() => setPhotoOpen(photo)}>
                              <View style={{ display: 'flex', flexDirection: 'row', gap: 15, margin: 10, alignItems: 'center' }}>
                                <Image source={require('../../assets/images/attachment.png')} style={{ width: 16, height: 30 }} />
                                <Text style={{ fontSize: 18 }}>{photo.title}</Text>
                              </View>
                            </Pressable>
                          ))}
                        </View>
                      )}

                      {/* NOTES TAB */}

                      {activeTab === 'notes' && (
                        <View style={{ width: '100%', display: 'flex', flexDirection: 'column', padding: 5 }}>
                          <Text style={{ fontSize: 17, padding: 5 }}>{pet.notes}</Text>
                        </View>
                      )}

                    </View>
                  </View>
                </View>)}
            </View>);
        })}
      </View >
    </>
  );
}

const styles = StyleSheet.create({
  pet_header_closed: {
    width: '100%',
    backgroundColor: '#5C9E3F',
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
  },
  pet_header_open: {
    width: '100%',
    backgroundColor: '#5C9E3F',
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  activeTab: {
    backgroundColor: 'white',
    borderRadius: 0,
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    padding: 2,
    fontSize: 14,
    height: 30
  },
  unactiveTab: {
    backgroundColor: '#EFEFEF',
    borderRadius: 0,
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    padding: 2,
    fontSize: 14,
  },
  summary_list_container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 17,
    fontWeight: 500
  }
})