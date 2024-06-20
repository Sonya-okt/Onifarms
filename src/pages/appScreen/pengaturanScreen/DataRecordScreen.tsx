/* eslint-disable @typescript-eslint/no-unused-vars */
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
import firestore from '@react-native-firebase/firestore';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Toast from 'react-native-toast-message';
import {Row, Table, Cell} from 'react-native-table-component';

interface DataRecord {
  date: string;
  temperature: string;
  humidity: string;
  pH: string;
  n: string;
  p: string;
  k: string;
}

const ItemComponent: React.FC<{item: DataRecord}> = ({item}) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={[styles.dataTableText, {width: wp('20%')}]}>
        {item.date}
      </Text>
      <Text style={[styles.dataTableText, {width: wp('11%')}]}>
        {item.temperature}
      </Text>
      <Text style={[styles.dataTableText, {width: wp('15%')}]}>
        {item.humidity}
      </Text>
      <Text style={[styles.dataTableText, {width: wp('11%')}]}>{item.pH}</Text>
      <Text style={[styles.dataTableText, {width: wp('11%')}]}>{item.n}</Text>
      <Text style={[styles.dataTableText, {width: wp('11%')}]}>{item.p}</Text>
      <Text style={[styles.dataTableText, {width: wp('11%')}]}>{item.k}</Text>
    </View>
  );
};

const DataRecordScreen: React.FC = () => {
  const [data, setData] = useState<DataRecord[]>([
    {
      date: '2024-06-01',
      temperature: '25',
      humidity: '60',
      pH: '4.5',
      n: '10',
      p: '5',
      k: '20',
    },
    {
      date: '2024-06-02',
      temperature: '26',
      humidity: '65',
      pH: '4.6',
      n: '500',
      p: '500',
      k: '500',
    },
  ]);
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState<boolean>(false);
  const [showToDatePicker, setShowToDatePicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  const tableHead = ['Tanggal', 'Suhu', 'Kelembapan', 'pH', 'N', 'P', 'K'];
  const widthArr: number[] = [
    wp('20%'),
    wp('11%'),
    wp('15%'),
    wp('11%'),
    wp('11%'),
    wp('11%'),
    wp('11%'),
  ];

  const fetchData = async (fromDate: Date, toDate: Date) => {
    setLoading(true);
    try {
      const snapshot = await firestore()
        .collection('OnifarmDatabase')
        .doc('1001')
        .collection('data')
        .where('date', '>=', fromDate.toISOString())
        .where('date', '<=', toDate.toISOString())
        .get();
      const fetchedData = snapshot.docs.map(doc => doc.data() as DataRecord);
      setData(fetchedData);
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
  const generatePDF = async () => {
    setDownloading(true);
    try {
      const options = {
        html: '<h1>Data Record</h1>',
        fileName: 'DataRecord',
        directory: 'Documents',
      };
      const file = await RNHTMLtoPDF.convert(options);
      Toast.show({
        type: 'success',
        text1: 'PDF Generated',
        text2: 'PDF has been saved to ' + file.filePath,
      });
    } catch (error) {
      console.error('Error generating PDF: ', error);
      Alert.alert('Error', 'Failed to generate PDF.');
    } finally {
      setDownloading(false);
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
                {fromDate.toLocaleDateString()}
              </Text>
              {/* Teks diatas Dapat memilih tanggal */}
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
              {/* Teks diatas Dapat memilih tanggal */}
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={filterData}>
            <Text style={styles.filterButtonText}>Filter Data</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tableContainer}>
          {/* Berisi tabel dengan judul 'Tanggal, Suhu, Kelembapan, N, P, K' */}
          <Table style={styles.tableStyle}>
            <Row
              data={tableHead}
              style={styles.headTable}
              textStyle={styles.headText}
              widthArr={widthArr}
            />
          </Table>
          <FlatList
            data={data}
            keyExtractor={(_item, index) => index.toString()}
            renderItem={({item}) => <ItemComponent item={item} />}
          />
        </View>
        <TouchableOpacity style={styles.downloadbutton} onPress={generatePDF}>
          <Text style={styles.textDownloadButton}>Download pdf</Text>
        </TouchableOpacity>
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
    // borderWidth: wp('0.1%'),
    // borderColor: Color.PRIMARY,
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
  downloadbutton: {
    backgroundColor: Color.PRIMARY,
    borderRadius: wp('4%'),
    width: wp('30%'),
    height: hp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('3%'),
    alignSelf: 'center',
  },
  textDownloadButton: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: wp('3.4%'),
    color: Color.WHITE,
  },
  tableStyle: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: Color.PRIMARY,
    justifyContent: 'space-between',
  },
  headTable: {
    height: hp('3.5%'),
    justifyContent: 'space-between',
  },
  headText: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: 8,
    color: Color.WHITE,
    textAlign: 'center',
    // borderWidth: wp('0.1%'),
    // borderColor: Color.WHITE,
  },
  textTable: {
    fontFamily: FontFamily.poppinsRegular,
    fontSize: 10,
    color: Color.BLACK,
    textAlign: 'center',
  },
  dataTableText: {
    color: Color.BLACK,
    height: '100%',
    fontFamily: FontFamily.poppinsRegular,
    fontSize: wp('3%'),
    // borderWidth: wp('0.1%'),
    // borderColor: Color.PRIMARY,
    textAlign: 'center',
  },
});

export default DataRecordScreen;
