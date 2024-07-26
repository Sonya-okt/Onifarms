import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  Platform,
  ToastAndroid,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Color, FontFamily} from '../../../constants/GlobalStyles';
import database from '@react-native-firebase/database';
import RNSecureStorage from 'rn-secure-storage';
import auth from '@react-native-firebase/auth';

interface DataRecord {
  date: string;
  temperature: number;
  humidity: number;
  pH: number;
  n: number;
  p: number;
  k: number;
}

const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const ItemComponent: React.FC<{item: DataRecord}> = ({item}) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={[styles.dataTableText, {width: wp('20%')}]}>
        {item.date || '-'}
      </Text>
      <Text style={[styles.dataTableText, {width: wp('11%')}]}>
        {item.temperature !== undefined
          ? Math.round(item.temperature).toString()
          : '-'}
      </Text>
      <Text style={[styles.dataTableText, {width: wp('15%')}]}>
        {item.humidity !== undefined
          ? Math.round(item.humidity).toString()
          : '-'}
      </Text>
      <Text style={[styles.dataTableText, {width: wp('11%')}]}>
        {item.pH !== undefined ? item.pH.toFixed(1) : '-'}
      </Text>
      <Text style={[styles.dataTableText, {width: wp('11%')}]}>
        {item.n !== undefined ? Math.round(item.n).toString() : '-'}
      </Text>
      <Text style={[styles.dataTableText, {width: wp('11%')}]}>
        {item.p !== undefined ? Math.round(item.p).toString() : '-'}
      </Text>
      <Text style={[styles.dataTableText, {width: wp('11%')}]}>
        {item.k !== undefined ? Math.round(item.k).toString() : '-'}
      </Text>
    </View>
  );
};

const DataRecordScreen: React.FC = () => {
  const [data, setData] = useState<DataRecord[]>([]);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFromDatePicker, setShowFromDatePicker] = useState<boolean>(false);
  const [showToDatePicker, setShowToDatePicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [uid, setUid] = useState<string | null>(null);

  const tableHead = ['Tanggal', 'Suhu', 'Kelembapan', 'pH', 'N', 'P', 'K'];

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
      Alert.alert(message);
    }
  };

  useEffect(() => {
    const fetchUserUIDAndData = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const uid = await RNSecureStorage.getItem('userUID');
          if (uid) {
            setUid(uid);
            fetchData(uid, fromDate, toDate);
          }
        } else {
          console.error('User is not authenticated');
        }
      } catch (error) {
        console.error('Error fetching User UID:', error);
      }
    };

    fetchUserUIDAndData();

    return () => {
      if (uid) {
        const dataRef = database().ref(`${uid}/DataRecord`);
        dataRef.off();
      }
    };
  }, [uid, fromDate, toDate]);

  const fetchData = (
    uid: string,
    fromDate: Date | null,
    toDate: Date | null,
  ) => {
    setLoading(true);
    const dataRef = database().ref(`${uid}/DataRecord`);

    const onValueChange = (snapshot: any) => {
      const fetchedData = snapshot.val();
      const dataList: DataRecord[] = [];

      if (fetchedData) {
        const allDates = Object.keys(fetchedData).sort(
          (a, b) => new Date(b).getTime() - new Date(a).getTime(),
        );

        for (const dateKey of allDates) {
          const recordDate = new Date(dateKey);

          if (
            !fromDate ||
            !toDate ||
            (recordDate >= new Date(fromDate.setHours(0, 0, 0, 0)) &&
              recordDate <= new Date(toDate.setHours(23, 59, 59, 999)))
          ) {
            const record = fetchedData[dateKey];
            dataList.push({
              date: formatDate(recordDate),
              temperature: record.suhu,
              humidity: record.kelembapan,
              pH: record.ph,
              n: record.nitrogen,
              p: record.phosphor,
              k: record.kalium,
            });
          }
        }
        setData(dataList);
      }

      setLoading(false);
    };

    dataRef.on('value', onValueChange, error => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });

    return () => {
      dataRef.off('value', onValueChange);
    };
  };

  const onFromDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    const currentDate = selectedDate || fromDate;
    setShowFromDatePicker(false);
    if (currentDate && currentDate > new Date()) {
      Alert.alert(
        'Invalid Date',
        'Pemilihan tanggal tidak boleh melebihi tanggal sekarang',
      );
      return;
    }
    if (currentDate && toDate && currentDate > toDate) {
      Alert.alert(
        'Invalid Date Range',
        'Pemilihan tanggal akhir tidak boleh melebihi tanggal akhir',
      );
      return;
    }
    setFromDate(currentDate);
  };

  const onToDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || toDate;
    setShowToDatePicker(false);
    if (currentDate && currentDate > new Date()) {
      Alert.alert(
        'Invalid Date',
        'Tanggal akhir tidak boleh melebihi tanggal sekarang',
      );
      return;
    }
    if (currentDate && fromDate && currentDate < fromDate) {
      Alert.alert(
        'Invalid Date Range',
        'Tanggal akhir tidak boleh kurang dari tanggal awal',
      );
      return;
    }
    setToDate(currentDate);
  };

  const filterData = () => {
    if (fromDate && toDate && fromDate > toDate) {
      Alert.alert('Warning', 'Penangambilan data gagal dilakukan');
      return;
    }
    if (uid) {
      fetchData(uid, fromDate, toDate);
    }
  };

  return (
    <LinearGradient
      style={styles.linearGradient}
      colors={['#E0F8F0', '#FFFFFF', '#9BD5B5']}
      start={{x: 0, y: -0.4}}
      end={{x: 0.9, y: 1.5}}
      locations={[0.1, 0.5, 1]}>
      <View style={styles.container}>
        <View style={styles.pickDateContainer}>
          <View>
            <Text style={styles.fromText}> From :</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowFromDatePicker(true)}>
              <Text style={styles.dateFromText}>
                {fromDate ? formatDate(fromDate) : '-'}
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={[styles.fromText]}> To :</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowToDatePicker(true)}>
              <Text style={styles.dateFromText}>
                {toDate ? formatDate(toDate) : '-'}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={filterData}>
            <Text style={styles.filterButtonText}>Filter Data</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tableContainer}>
          <View style={styles.headerContainer}>
            {tableHead.map((header, index) => (
              <Text
                key={index}
                style={[
                  styles.headText,
                  {
                    width: wp(
                      ['20%', '10%', '17.5%', '8.5%', '11%', '11%', '11%'][
                        index
                      ],
                    ),
                  },
                ]}>
                {header}
              </Text>
            ))}
          </View>
          {loading ? (
            <ActivityIndicator size="large" color={Color.PRIMARY} />
          ) : (
            <FlatList
              data={data}
              keyExtractor={(_item, index) => index.toString()}
              renderItem={({item}) => <ItemComponent item={item} />}
            />
          )}
        </View>
      </View>
      {showFromDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={fromDate || new Date()}
          mode="date"
          display="default"
          onChange={onFromDateChange}
          maximumDate={new Date()}
        />
      )}
      {showToDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={toDate || new Date()}
          mode="date"
          display="default"
          onChange={onToDateChange}
          maximumDate={new Date()}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp('100%'),
    width: wp('100%'),
    paddingTop: hp('5%'),
  },
  linearGradient: {
    flex: 1,
    borderWidth: wp('0.1%'),
    borderColor: Color.PRIMARY,
    alignItems: 'center',
    marginTop: hp('-2%'),
  },
  itemContainer: {
    paddingVertical: hp('0.5%'),
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#cccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickDateContainer: {
    paddingHorizontal: wp('5%'),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButton: {
    borderWidth: wp('0.2%'),
    borderColor: Color.PRIMARY,
    backgroundColor: Color.WHITE,
    borderRadius: wp('2.5%'),
    width: wp('25%'),
    height: hp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  fromText: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: wp('3.2%'),
    color: Color.PRIMARY,
  },
  dateFromText: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: wp('3.2%'),
    color: Color.PRIMARY,
  },
  filterButton: {
    backgroundColor: Color.ORANGE_WARN,
    borderRadius: wp('2%'),
    width: wp('25%'),
    height: hp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  filterButtonText: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: wp('3.2%'),
    color: Color.WHITE,
  },
  tableContainer: {
    width: wp('90%'),
    height: hp('60%'),
    backgroundColor: Color.WHITE,
    borderWidth: wp('0.1%'),
    borderColor: Color.PRIMARY,
    borderRadius: wp('2.5%'),
    marginTop: hp('4%'),
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#cccc',
    backgroundColor: Color.PRIMARY,
  },
  headText: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: wp('2%'),
    color: Color.WHITE,
    textAlign: 'center',
    padding: hp('1%'),
  },
  dataTableText: {
    color: Color.BLACK,
    fontFamily: FontFamily.poppinsRegular,
    fontSize: wp('3%'),
    textAlign: 'center',
  },
});

export default DataRecordScreen;
