import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Color, FontFamily} from '../../../constants/GlobalStyles';
import ToggleSwitch from 'toggle-switch-react-native';
import XNotificationPenyiraman from '../../../components/svgFunComponent/pengaturanSvg/XNotificationPenyiraman';
import ChecklistNotificationPenyiraman from '../../../components/svgFunComponent/pengaturanSvg/ChecklistNotificationPenyiraman';
import AddAlarmList from '../../../components/svgFunComponent/pengaturanSvg/AddAlarmList';
import firestore from '@react-native-firebase/firestore';
import RNSecureStorage from 'rn-secure-storage';
import CustomTimePicker from '../../../components/daytimepick/CustomTimePicker';

interface Item {
  id: string;
  time: string;
  text: string;
  days: string[];
  isOn: boolean;
}

interface FirestoreData {
  time: string;
  status: boolean;
  [key: string]: any; // This allows dynamic keys for day1, day2, etc.
}

interface Props {
  delete?: (id: string) => void;
}

const JadwalPenyiramanScreen: React.FC<Props> = props => {
  const [data, setData] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [tempSelectedTime, setTempSelectedTime] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [userUID, setUserUID] = useState<string | null>(null);
  const allDays = [
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
    'Minggu',
  ];

  useEffect(() => {
    const fetchUserUIDAndData = async () => {
      try {
        const uid = await RNSecureStorage.getItem('userUID');
        if (uid) {
          setUserUID(uid);
          fetchFirebaseData(uid);
        }
      } catch (error) {
        console.error('Error fetching User UID:', error);
      }
    };

    fetchUserUIDAndData();
  }, []);

  useEffect(() => {
    if (userUID) {
      saveData();
    }
  }, [data, userUID]);

  const saveData = async () => {
    if (!userUID) return;

    const batch = firestore().batch();
    const userDoc = firestore().collection(userUID).doc('watering');

    data.forEach((item, index) => {
      const itemRef = userDoc.collection(`watering${index + 1}`).doc('status');
      const firestoreData: FirestoreData = {
        time: item.time,
        status: item.isOn,
      };
      item.days.forEach((day, i) => {
        firestoreData[`day${i + 1}`] = day;
      });
      batch.set(itemRef, firestoreData);
    });

    await batch.commit();
  };

  const fetchFirebaseData = async (uid: string) => {
    const userDoc = firestore().collection(uid).doc('watering');
    const items: Item[] = [];

    for (let i = 0; ; i++) {
      const itemRef = userDoc.collection(`watering${i + 1}`).doc('status');
      const doc = await itemRef.get();

      if (!doc.exists) break;

      const data = doc.data() as FirestoreData;
      if (data) {
        const days = Object.keys(data)
          .filter(key => key.startsWith('day'))
          .map(key => data[key]);

        items.push({
          id: (i + 1).toString(),
          time: data.time,
          text: `Penyiraman ${i + 1}`,
          days,
          isOn: Boolean(data.status), // Ensure `isOn` is boolean
        });
      }
    }

    setData(items);
  };

  const handleToggle = (item: Item) => {
    const newData = data.map(d =>
      d.id === item.id ? {...d, isOn: !item.isOn} : d,
    );
    setData(newData);
  };

  const handlePressItem = (item: Item) => {
    setSelectedItem(item);
    setShowTimePicker(true);
  };

  const handleConfirmTime = (selectedTime: string) => {
    setTempSelectedTime(selectedTime);
    confirmTimeSelection(selectedTime);
  };

  const handleCancelTime = () => {
    setShowTimePicker(false);
    setTempSelectedTime(null);
  };

  const confirmTimeSelection = (selectedTime: string) => {
    if (selectedItem && selectedTime) {
      const newData = data.map(d =>
        d.id === selectedItem.id ? {...d, time: selectedTime} : d,
      );
      setData(newData);
    }
    setShowTimePicker(false);
    setShowDayPicker(true);
  };

  const handleDaySelection = (day: string) => {
    setSelectedDays(prevDays =>
      prevDays.includes(day)
        ? prevDays.filter(d => d !== day)
        : [...prevDays, day],
    );
  };

  const confirmDaySelection = () => {
    if (selectedItem) {
      const newData = data.map(d =>
        d.id === selectedItem.id ? {...d, days: selectedDays} : d,
      );
      setData(newData);
    }
    setShowDayPicker(false);
    setSelectedDays([]);
  };

  const addNewAlarm = () => {
    const newId = (data.length + 1).toString();
    const newText = `Penyiraman ${newId}`;
    const newAlarm = {
      id: newId,
      time: '00:00',
      text: newText,
      days: [],
      isOn: false,
    };
    setData([...data, newAlarm]);
  };

  const handleLongPressItem = (item: Item) => {
    Alert.alert(
      'Hapus Alarm',
      `Apakah Anda yakin ingin menghapus ${item.text}?`,
      [
        {text: 'Tidak', style: 'cancel'},
        {
          text: 'Ya',
          onPress: () => {
            setData(data.filter(d => d.id !== item.id));
            deleteAlarm(item.id);
          },
        },
      ],
      {cancelable: true},
    );
  };

  const deleteAlarm = async (id: string) => {
    if (!userUID) return;

    const userDoc = firestore().collection(userUID).doc('watering');
    const itemRef = userDoc.collection(`watering${id}`).doc('status');
    await itemRef.delete();
  };

  const renderItem = ({item}: {item: Item}) => {
    const dayString =
      item.days.length === allDays.length
        ? 'Setiap hari'
        : item.days.length > 0
          ? ` - ${item.days.map(day => day.slice(0, 3)).join(', ')}`
          : '';
    return (
      <TouchableOpacity
        style={styles.jadwalPenyiramanContainer}
        onPress={() => handlePressItem(item)}
        onLongPress={() => handleLongPressItem(item)}>
        <View style={styles.jadwalPenyiramanItem}>
          <Text style={styles.jadwalPenyiramanItemHours}>{item.time}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.jadwalPenyiramanItemText}>{item.text}</Text>
            {item.days.length > 0 && (
              <Text style={styles.jadwalPenyiramanDayText}>{dayString}</Text>
            )}
          </View>
        </View>
        <ToggleSwitch
          isOn={item.isOn}
          onColor="green"
          offColor="red"
          size="medium"
          onToggle={() => handleToggle(item)}
          thumbOnStyle={{backgroundColor: Color.WHITE}}
          thumbOffStyle={{backgroundColor: Color.GREY}}
          trackOffStyle={{
            backgroundColor: Color.WHITE,
            borderColor: Color.GREY,
            borderWidth: 1,
          }}
          trackOnStyle={{backgroundColor: Color.PRIMARY}}
          icon={
            item.isOn ? (
              <ChecklistNotificationPenyiraman />
            ) : (
              <XNotificationPenyiraman />
            )
          }
        />
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      style={styles.linearGradient}
      colors={['#E0F8F0', '#FFFFFF', '#9BD5B5']}
      start={{x: 0, y: -0.4}}
      end={{x: 0.9, y: 1.5}}
      locations={[0.1, 0.5, 1]}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.addAlarm} onPress={addNewAlarm}>
          <AddAlarmList />
        </TouchableOpacity>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>

      <CustomTimePicker
        isVisible={showTimePicker}
        onConfirm={handleConfirmTime}
        onCancel={handleCancelTime}
      />

      {showDayPicker && (
        <Modal transparent={true} animationType="slide" visible={showDayPicker}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.daySelection}>
                {allDays.map(day => (
                  <TouchableOpacity
                    key={day}
                    onPress={() => handleDaySelection(day)}>
                    <Text
                      style={
                        selectedDays.includes(day)
                          ? styles.selectedDay
                          : styles.unselectedDay
                      }>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={confirmDaySelection}>
                  <Text style={styles.confirmButtonText}>Selesai</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    borderWidth: wp('0.1%'),
    borderColor: Color.PRIMARY,
    alignItems: 'center',
    marginTop: hp('-2%'),
  },
  container: {
    height: hp('100%'),
    width: wp('100%'),
    paddingTop: hp('5%'),
    paddingBottom: hp('5%'),
  },
  jadwalPenyiramanContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Color.WHITE,
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('2%'),
    borderRadius: wp('3.5%'),
    borderWidth: wp('0.3%'),
    borderColor: Color.PRIMARY,
    width: wp('90%'),
    height: hp('12%'),
    marginVertical: hp('1%'),
  },
  jadwalPenyiramanItem: {
    flex: 1,
  },
  jadwalPenyiramanItemHours: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: 24,
    color: Color.PRIMARY,
    marginBottom: hp('-0.5%'),
  },
  jadwalPenyiramanItemText: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: 13,
    color: Color.PRIMARY,
  },
  jadwalPenyiramanDayText: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: 11,
    color: Color.GREY,
    marginLeft: wp('2%'),
    marginTop: hp('0.2%'),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: wp('80%'),
    backgroundColor: Color.WHITE,
    padding: wp('5%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
  },
  daySelection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: hp('2%'),
  },
  selectedDay: {
    fontSize: 16,
    color: Color.PRIMARY,
    marginHorizontal: wp('1%'),
    marginVertical: hp('0.5%'),
    textDecorationLine: 'underline',
  },
  unselectedDay: {
    fontSize: 16,
    color: Color.GREY,
    marginHorizontal: wp('1%'),
    marginVertical: hp('0.5%'),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: hp('2%'),
  },
  confirmButtonText: {
    fontSize: 16,
    color: Color.PRIMARY,
    textDecorationLine: 'underline',
  },
  addAlarm: {
    height: hp('6.5%'),
    width: wp('13.1%'),
    aspectRatio: 1,
    position: 'absolute',
    right: wp('9%'),
    bottom: hp('9%'),
    backgroundColor: Color.GREEN_BOTTOMNAV,
    borderRadius: wp('100%'),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});

export default JadwalPenyiramanScreen;
