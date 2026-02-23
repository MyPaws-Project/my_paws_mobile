import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import { downloadImage } from "../../utils/downoadPermission";
import { useClientPets } from "../../hooks/useClientPets";
import { useClient } from "../../context/ClientContext";
import { pickImageFromLibrary, uploadImageToCloudinary } from "../../utils/petImagePicker";

const PETS = [
  {
    id: 'rand_id1',
    name: 'Simba',
    animal: 'cat',
    breed: 'Ginger Cat',
    photoUrl: 'none',
    gender: 'Male',
    weight: '3.9Kg',
    age: '1 year',
    allergies: 'none',
    illnesses: 'none',
    ownerId: 'owner_Id',
    medication: 'none',
    notes: 'This cat is generally calm and well-behaved, showing curiosity in familiar environments but some hesitation around new people. It is an indoor-only cat with a normal appetite and regular litter box use. The cat prefers quiet spaces, enjoys resting in warm areas, and may become mildly anxious during veterinary visits. No known allergies or chronic conditions have been reported.',
    records: [
      {
        name: 'simba-pata-izquierda-1',
        adress: 'https://res.cloudinary.com/daw1qkmqz/image/upload/v1770581225/simba-pata-izquierda-1_jq5miv.jpg'
      },
      {
        name: 'simba-pata-izquierda-2',
        adress: 'https://res.cloudinary.com/daw1qkmqz/image/upload/v1770581238/simba-pata-izquierda-2_mpnihh.jpg'
      },
      {
        name: 'simba-torax-1',
        adress: 'https://res.cloudinary.com/daw1qkmqz/image/upload/v1770581246/simba-torax-1_dlalji.jpg'
      },
      {
        name: 'simba-torax-2',
        adress: 'https://res.cloudinary.com/daw1qkmqz/image/upload/v1770581255/simba-torax-2_k9h35h.jpg'
      },
    ],
    vaccines: {
      Rabies: {
        doses: [
          '20/12/2025',
          '01/01/2026',
          '15/01/2026'
        ],
        next_vaccine: `${new Date(new Date().setFullYear(new Date().getFullYear() + 1))}`
      },
      Triple_Feline: {
        doses: [
          '20/12/2025',
          '01/01/2026',
          '15/01/2026'
        ],
        next_vaccine: `${new Date(new Date().setFullYear(new Date().getFullYear() + 2))}`
      }
    },
    consults: [
      {
        id: 'random_id_xd',
        type: 'Consult',
        attending_veterinarian: 'Dr. Example',
        time: 'Wed Jan 28 2026 09:20:00',
        notes: 'Concerns about redness around scar tissue, antibiotics ordered for two weeks. Closing nicely, vitals good otherwise.',
        prescription: {
          name: 'Amoxicillin',
          amount: '1/2 tablet',
          frequency: '12 hours',
          time: '2 weeks'
        },
      },
      {
        id: 'consult_002',
        type: 'Consult',
        attending_veterinarian: 'Dr. Laura Smith',
        time: 'Fri Jan 30 2026 14:45:00',
        notes: 'Annual checkup performed. Weight stable, coat healthy. Mild tartar buildup observed; dental cleaning recommended within the year.',
        prescription: {
          name: 'None',
          amount: '-',
          frequency: '-',
          time: '-'
        },
      },
      {
        id: 'consult_003',
        type: 'Consult',
        attending_veterinarian: 'Dr. Miguel Alvarez',
        time: 'Mon Feb 02 2026 11:10:00',
        notes: 'Presented with intermittent limping on right hind leg. No fracture detected on exam. Rest advised and anti-inflammatory prescribed.',
        prescription: {
          name: 'Carprofen',
          amount: '1 tablet',
          frequency: '24 hours',
          time: '5 days'
        },
      },
      {
        id: 'consult_004',
        type: 'Consult',
        attending_veterinarian: 'Dr. Hannah Lee',
        time: 'Thu Feb 05 2026 16:00:00',
        notes: 'Vomiting reported over last 24 hours. Abdomen soft on palpation. Likely dietary indiscretion. Bland diet recommended.',
        prescription: {
          name: 'Metoclopramide',
          amount: '5 ml',
          frequency: '8 hours',
          time: '3 days'
        },
      },
      {
        id: 'consult_005',
        type: 'Consult',
        attending_veterinarian: 'Dr. James Carter',
        time: 'Sun Feb 08 2026 10:30:00',
        notes: 'Skin itching and redness observed around ears and paws. Possible allergic reaction. Monitoring response to treatment.',
        prescription: {
          name: 'Prednisone',
          amount: '1 tablet',
          frequency: '24 hours',
          time: '7 days'
        },
      },
      {
        id: 'consult_006',
        type: 'Consult',
        attending_veterinarian: 'Dr. Sofia Mendes',
        time: 'Wed Feb 11 2026 13:15:00',
        notes: 'Vaccinations updated. Mild lethargy expected for next 24 hours. Owner advised to monitor appetite and activity.',
        prescription: {
          name: 'None',
          amount: '-',
          frequency: '-',
          time: '-'
        },
      },
      {
        id: 'consult_007',
        type: 'Consult',
        attending_veterinarian: 'Dr. Robert Nguyen',
        time: 'Sat Feb 14 2026 09:50:00',
        notes: 'Follow-up visit post dental procedure. Healing well, no signs of infection. Sutures intact.',
        prescription: {
          name: 'Meloxicam',
          amount: '0.1 ml',
          frequency: '24 hours',
          time: '3 days'
        },
      },
    ]
  },
  {
    id: 'rand_id2',
    name: 'Manuela',
    breed: 'Maltese Poodle',
    animal: 'dog',
    photoUrl: 'none',
    gender: 'Male',
    weight: '3.9Kg',
    age: '1 year',
    allergies: 'Pollen',
    illnesses: 'Atopic Dermatitis',
    ownerId: 'owner_Id',
    medication: 'none',
    notes: '',
    records: [
      {
        name: 'name1',
        adress: 'https://act-webstatic.hoyoverse.com/upload/contentweb/2022/06/29/1346e716a5106af1799a0689dbb447d4_2694372439747645027.png'
      },
      {
        name: 'name2',
        adress: 'https://hoyo.global/wp-content/uploads/2024/08/emilie-avatar-profile-genshin-impact.webp'
      },
      {
        name: 'name3',
        adress: 'https://fastcdn.hoyoverse.com/content-v2/hk4e/161036/f22cf14c3c9f608d2cd4a2c3c414f81a_7856336448750181286.png'
      },
      {
        name: 'name4',
        adress: 'https://fastcdn.hoyoverse.com/content-v2/hk4e/156697/5f44d39593b1563221226dcce9884217_1259178755095507549.png'
      },
    ],
    vaccines: {
      Rabies: {
        doses: [
          '20/12/2025',
          '01/01/2026',
          '15/01/2026'
        ],
        next_vaccine: `${new Date(new Date().setFullYear(new Date().getFullYear() + 1))}`
      },
      Triple_Feline: {
        doses: [
          '22/12/2025',
          '03/01/2026',
          '17/01/2026'
        ],
        next_vaccine: `${new Date(new Date().setFullYear(new Date().getFullYear() + 2))}`
      }
    },
    consults: [
      {
        id: 'random_id_xd',
        type: 'Consult',
        attending_veterinarian: 'Dr. Example',
        time: 'Wed Jan 28 2026 09:20:00',
        notes: 'Concerns about redness around scar tissue, antibiotics ordered for two weeks. Closing nicely, vitals good otherwise.',
        prescription: {
          name: 'Amoxicillin',
          amount: '1/2 tablet',
          frequency: '12 hours',
          time: '2 weeks'
        },
      },
      {
        id: 'consult_002',
        type: 'Consult',
        attending_veterinarian: 'Dr. Laura Smith',
        time: 'Fri Jan 30 2026 14:45:00',
        notes: 'Annual checkup performed. Weight stable, coat healthy. Mild tartar buildup observed; dental cleaning recommended within the year.',
        prescription: {
          name: 'None',
          amount: '-',
          frequency: '-',
          time: '-'
        },
      },
      {
        id: 'consult_006',
        type: 'Consult',
        attending_veterinarian: 'Dr. Sofia Mendes',
        time: 'Wed Feb 11 2026 13:15:00',
        notes: 'Vaccinations updated. Mild lethargy expected for next 24 hours. Owner advised to monitor appetite and activity.',
        prescription: {
          name: 'None',
          amount: '-',
          frequency: '-',
          time: '-'
        },
      },
      {
        id: 'consult_007',
        type: 'Consult',
        attending_veterinarian: 'Dr. Robert Nguyen',
        time: 'Sat Feb 14 2026 09:50:00',
        notes: 'Follow-up visit post dental procedure. Healing well, no signs of infection. Sutures intact.',
        prescription: {
          name: 'Meloxicam',
          amount: '0.1 ml',
          frequency: '24 hours',
          time: '3 days'
        },
      },
    ]
  }
]

const getTabs = (pet) => [
  { key: 'summary', label: 'Summary' },
  { key: 'consults', label: 'Consults', count: pet.consults?.length ?? 0 },
  { key: 'vaccines', label: 'Vaccines' },
  { key: 'records', label: 'Records' },
  { key: 'notes', label: 'Notes' },
];

export default function Files() {
  const [openPetId, setOpenPetId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [onRecordOpen, setOnRecordOpen] = useState<string | null>(null)
  const [petImages, setPetImages] = useState<Record<string, string>>({});
  const [uploadingPetId, setUploadingPetId] = useState<string | null>(null);
  const { client } = useClient();

  const handlePickImage = async (petId: string) => {
    const localUri = await pickImageFromLibrary();
    if (!localUri) return;

    setUploadingPetId(petId);
    const url = await uploadImageToCloudinary(localUri);

    if (url) {
      setPetImages(prev => ({
        ...prev,
        [petId]: url,
      }));
    }

    setUploadingPetId(null);
  };


  return (
    <>
      {/* IMAGE VIEW */}

      {onRecordOpen && (
        <View style={{ backgroundColor: 'black', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <View style={{ alignSelf: 'flex-end' }}>
            <Pressable onPress={() => setOnRecordOpen(null)}>
              <Ionicons name="close" color={'#fff'} size={30} />
            </Pressable>
          </View>
          <Image source={{ uri: onRecordOpen }} style={{ width: '100%', height: '90%' }} resizeMode="contain" />
          <View style={{ alignSelf: 'flex-end', height: 40 }}>
            <Pressable onPress={() => { console.log('button press'); downloadImage(onRecordOpen) }}>
              <Image source={require('../../assets/images/download.png')} style={{ height: 25, width: 25 }} />
            </Pressable>
          </View>
        </View>)}
      <View style={{ backgroundColor: 'white', width: '100%', height: '100%', paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }}>
        {PETS.map(pet => {
          const isOpen = openPetId === pet.id;
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
                  <View style={{ width: '100%', height: '100%', borderRadius: 5, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
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
                            <Pressable onPress={() => { handlePickImage(pet.id) }}>
                              <Image source={require('../../assets/images/dots.png')}
                                style={{ width: 30, height: 12, position: "absolute", top: 128, left: 110, zIndex: 1, backgroundColor: 'white', borderRadius: 3 }} />
                              <Image
                                source={
                                  petImages[pet.id]
                                    ? { uri: petImages[pet.id] }
                                    : pet.animal === 'cat'
                                      ? require('../../assets/images/placeholder-cat.png')
                                      : require('../../assets/images/placeholder-dog.png')
                                }
                                style={{ width: 150, height: 150, borderRadius: 5, boxShadow: '1px 1px 8px gray' }}
                              />
                            </Pressable>
                            <View style={{ marginLeft: 15, display: 'flex', justifyContent: 'space-around' }}>
                              <View><Text style={styles.title}>{pet.breed}</Text></View>
                              <View style={styles.summary_list_container}>
                                <Image source={require('../../assets/images/male.png')} style={{ width: 15, height: 15 }} />
                                <Text style={{ fontSize: 16, margin: 5 }}>{' •  '}{pet.gender}</Text></View>
                              <View style={styles.summary_list_container}>
                                <Image source={require('../../assets/images/weight.png')} style={{ width: 15, height: 15 }} />
                                <Text style={{ fontSize: 16, margin: 5 }}>{' •  '}{pet.weight}</Text></View>
                              <View style={styles.summary_list_container}>
                                <Image source={require('../../assets/images/cake.png')} style={{ width: 15, height: 15 }} />
                                <Text style={{ fontSize: 16, margin: 5 }}>{' •  '}{pet.age}</Text></View>
                            </View>
                          </View>
                          <View style={{ margin: 8, width: '95%', height: 1, backgroundColor: 'gray' }}></View>
                          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ display: 'flex', flexDirection: 'column', gap: 10, marginRight: 20 }}>
                              <View style={{ borderRadius: 5, backgroundColor: '#EE2623', padding: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20, justifyContent: 'flex-start', width: '100%', boxShadow: '1px 1px 8px gray' }}>
                                <Image source={require('../../assets/images/warning.png')} style={{ width: 22, height: 22, marginLeft: 5 }} />
                                <Text style={{ color: 'white', fontSize: 15, }}>{pet.allergies === 'none' ? 'No Allergies' : pet.allergies}</Text></View>
                              <View style={{ borderRadius: 5, backgroundColor: '#F19900', padding: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 20, justifyContent: 'flex-start', width: '100%', marginRight: 15, boxShadow: '1px 1px 8px gray' }}>
                                <Image source={require('../../assets/images/warning.png')} style={{ width: 22, height: 22, marginLeft: 5 }} />
                                <Text style={{ color: 'white', fontSize: 15 }}>{pet.illnesses === 'none' ? 'No illnesses' : pet.illnesses}</Text></View>
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
                                      (new Date(vaccine.next_vaccine).getTime() - Date.now()) /
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
                          {pet.consults.map(consult =>
                            <View key={consult.id} style={{ gap: 5, margin: 5, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                              <Image style={{ width: 36, height: 30 }} source={require('../../assets/images/heartbeat.png')} />
                              <View>
                                <Text style={{ fontSize: 18 }}>{consult.type} - {consult.attending_veterinarian}</Text>
                                <Text style={{ fontSize: 12 }}>{consult.time}</Text>
                              </View>
                              <Pressable onPress={() => console.log('info press', consult.id)}>
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
                          {pet.records?.map((record) => (
                            <Pressable key={record.name} onPress={() => setOnRecordOpen(record.adress)}>
                              <View style={{ display: 'flex', flexDirection: 'row', gap: 15, margin: 10, alignItems: 'center' }}>
                                <Image source={require('../../assets/images/attachment.png')} style={{ width: 16, height: 30 }} />
                                <Text style={{ fontSize: 18 }}>{record.name}</Text>
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
    borderRadius: 5,
  },
  pet_header_open: {
    width: '100%',
    backgroundColor: '#5C9E3F',
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  activeTab: {
    backgroundColor: 'white',
    borderRadius: 0,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    padding: 2,
    fontSize: 14,
    height: 30
  },
  unactiveTab: {
    backgroundColor: '#EFEFEF',
    borderRadius: 0,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
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