import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  ActivityIndicator,
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

interface DataRecord {
  date: string;
  temperature: number;
  humidity: number;
  pH: number;
  n: number;
  p: number;
  k: number;
}

const ItemComponent: React.FC<{item: DataRecord}> = ({item}) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={[styles.dataTableText, {width: wp('20%')}]}>
        {item.date}
      </Text>
      <Text style={[styles.dataTableText, {width: wp('11%')}]}>
        {item.temperature.toString()}
      </Text>
      <Text style={[styles.dataTableText, {width: wp('15%')}]}>
        {item.humidity.toString()}
      </Text>
      <Text style={[styles.dataTableText, {width: wp('11%')}]}>
        {item.pH.toString()}
      </Text>
      <Text style={[styles.dataTableText, {width: wp('11%')}]}>
        {item.n.toString()}
      </Text>
      <Text style={[styles.dataTableText, {width: wp('11%')}]}>
        {item.p.toString()}
      </Text>
      <Text style={[styles.dataTableText, {width: wp('11%')}]}>
        {item.k.toString()}
      </Text>
    </View>
  );
};

const DataRecordScreen: React.FC = () => {
  const [data, setData] = useState<DataRecord[]>([]);
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState<boolean>(false);
  const [showToDatePicker, setShowToDatePicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const tableHead = ['Tanggal', 'Suhu', 'Kelembapan', 'pH', 'N', 'P', 'K'];

  const currentData: {[key: string]: {sum: number; count: number}} = {
    temperature: {sum: 0, count: 0},
    humidity: {sum: 0, count: 0},
    pH: {sum: 0, count: 0},
    n: {sum: 0, count: 0},
    p: {sum: 0, count: 0},
    k: {sum: 0, count: 0},
  };
  let currentDate = new Date().toISOString().split('T')[0];

  const resetCurrentData = () => {
    currentData.temperature.sum = 0;
    currentData.temperature.count = 0;
    currentData.humidity.sum = 0;
    currentData.humidity.count = 0;
    currentData.pH.sum = 0;
    currentData.pH.count = 0;
    currentData.n.sum = 0;
    currentData.n.count = 0;
    currentData.p.sum = 0;
    currentData.p.count = 0;
    currentData.k.sum = 0;
    currentData.k.count = 0;
  };

  const calculateAndSaveAverage = async () => {
    const timestamp = new Date().getTime();
    const temperature =
      currentData.temperature.count > 0
        ? currentData.temperature.sum / currentData.temperature.count
        : 0;
    const humidity =
      currentData.humidity.count > 0
        ? currentData.humidity.sum / currentData.humidity.count
        : 0;
    const pH =
      currentData.pH.count > 0 ? currentData.pH.sum / currentData.pH.count : 0;
    const n =
      currentData.n.count > 0 ? currentData.n.sum / currentData.n.count : 0;
    const p =
      currentData.p.count > 0 ? currentData.p.sum / currentData.p.count : 0;
    const k =
      currentData.k.count > 0 ? currentData.k.sum / currentData.k.count : 0;

    try {
      await database().ref(`1002/DataRecord/${timestamp}`).set({
        suhu: temperature,
        kelembapan: humidity,
        ph: pH,
        nitrogen: n,
        phosphor: p,
        kalium: k,
      });

      console.log(`Data berhasil disimpan dengan timestamp: ${timestamp}`);
    } catch (error) {
      console.error('Error saving data: ', error);
    }
  };

  const fetchData = async (fromDate: Date, toDate: Date) => {
    setLoading(true);
    try {
      const snapshot = await database()
        .ref('1002/DataRecord')
        .orderByKey()
        .once('value');
      const fetchedData = snapshot.val();
      const dataList: DataRecord[] = [];
      for (const key in fetchedData) {
        const recordDate = new Date(parseInt(key));
        if (recordDate >= fromDate && recordDate <= toDate) {
          dataList.push({
            date: recordDate.toISOString().split('T')[0],
            temperature: fetchedData[key].suhu,
            humidity: fetchedData[key].kelembapan,
            pH: fetchedData[key].ph,
            n: fetchedData[key].nitrogen,
            p: fetchedData[key].phosphor,
            k: fetchedData[key].kalium,
          });
        }
      }
      setData(dataList);
      console.log('Data rata-rata berhasil ditampilkan di UI');
    } catch (error) {
      console.error('Error fetching data: ', error);
      Alert.alert('Error', 'Failed to fetch data from database.');
    } finally {
      setLoading(false);
    }
  };

  const onFromDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    const currentDate = selectedDate || fromDate;
    setShowFromDatePicker(false);
    if (currentDate > toDate) {
      Alert.alert('Invalid Date', 'From date cannot be later than To date');
      return;
    }
    setFromDate(currentDate);
  };

  const onToDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || toDate;
    setShowToDatePicker(false);
    if (currentDate < fromDate) {
      Alert.alert('Invalid Date', 'To date cannot be earlier than From date');
      return;
    }
    setToDate(currentDate);
  };

  const filterData = () => {
    if (fromDate > toDate) {
      Alert.alert(
        'Invalid Date Range',
        'From date cannot be later than To date',
      );
      return;
    }
    fetchData(fromDate, toDate);
  };

  useEffect(() => {
    const ref = database().ref('1002/Average');

    const updateData = async () => {
      try {
        const snapshot = await ref.once('value');
        const fetchedData = snapshot.val();
        const newDate = new Date().toISOString().split('T')[0];
        if (newDate !== currentDate) {
          await calculateAndSaveAverage();
          resetCurrentData();
          currentDate = newDate;
        }
        currentData.temperature.sum += parseFloat(fetchedData.suhu);
        currentData.temperature.count += 1;
        currentData.humidity.sum += parseFloat(fetchedData.kelembapan);
        currentData.humidity.count += 1;
        currentData.pH.sum += parseFloat(fetchedData.ph);
        currentData.pH.count += 1;
        currentData.n.sum += parseFloat(fetchedData.nitrogen);
        currentData.n.count += 1;
        currentData.p.sum += parseFloat(fetchedData.phosphor);
        currentData.p.count += 1;
        currentData.k.sum += parseFloat(fetchedData.kalium);
        currentData.k.count += 1;
      } catch (error) {
        console.error('Error updating data: ', error);
      }
    };

    const intervalId = setInterval(updateData, 600000); // Set interval to 10 minutes (600000 milliseconds)

    return () => {
      clearInterval(intervalId);
      ref.off();
    };
  }, []);

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
                {fromDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={[styles.fromText]}> To :</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowToDatePicker(true)}>
              <Text style={styles.dateFromText}>
                {toDate.toLocaleDateString()}
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
          value={fromDate}
          mode="date"
          display="default"
          onChange={onFromDateChange}
        />
      )}
      {showToDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={toDate}
          mode="date"
          display="default"
          onChange={onToDateChange}
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
