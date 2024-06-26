import React, {useCallback, useMemo, useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Color, FontFamily} from '../../../constants/GlobalStyles';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import {Rows, Table} from 'react-native-table-component';
import AddBendenganSvg from '../../../components/svgFunComponent/monitoringScreenSvg/AddBendenganSvg';
import AngleUpSvg from '../../../components/svgFunComponent/monitoringScreenSvg/AngleUpSvg';
import AngleDownSvg from '../../../components/svgFunComponent/monitoringScreenSvg/AngleDownSvg';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {getWeather, WeatherResponse} from '../../../components/api/OpenWeather';

type RootStackParamList = {
  MonitoringScreen: undefined;
  MapScreen: undefined;
};

const formatTanggal = () => {
  const bulan = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  const today = new Date();
  const tanggal = today.getDate();
  const namaBulan = bulan[today.getMonth()];
  const tahun = today.getFullYear();
  return `${tanggal} ${namaBulan} ${tahun}`;
};

interface BottomSheetsProps {
  weatherData: WeatherResponse | null;
  selectedLocation: string;
}

const BottomSheets: React.FC<BottomSheetsProps> = ({
  weatherData,
  selectedLocation,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [bendenganList, setBendenganList] = useState<number[]>([1]);
  const [currentWeatherData, setCurrentWeatherData] =
    useState<WeatherResponse | null>(weatherData);

  const snapPoints = useMemo(() => ['31%', '98%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    if (index === 1) {
      fetchCurrentWeather();
    }
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      fetchCurrentWeather();
    }
  }, [selectedLocation]);

  useEffect(() => {
    setCurrentWeatherData(weatherData);
  }, [weatherData]);

  const fetchCurrentWeather = async () => {
    if (selectedLocation) {
      try {
        const newWeatherData = await getWeather(selectedLocation);
        setCurrentWeatherData(newWeatherData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }
  };

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const toggleCollapse = (index: number) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const confirmDelete = (item: number) => {
    Alert.alert(
      'Konfirmasi Penghapusan',
      `Apakah Anda yakin ingin menghapus Bendengan ${item}?`,
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          onPress: () => deleteBendengan(item),
          style: 'destructive',
        },
      ],
    );
  };

  const deleteBendengan = (item: number) => {
    setBendenganList(prevList =>
      prevList.filter(bendengan => bendengan !== item),
    );
  };

  const tableData = [
    ['Suhu', ':', '25 - 30 °C'],
    ['Kelembapan', ':', '65 - 80 %'],
    ['pH', ':', '5 - 8'],
    ['Nitrogen', ':', '100 - 200ppm'],
    ['Phosphor', ':', '100 - 200ppm'],
    ['Kalium', ':', '100 - 200ppm'],
  ];

  const renderBendenganItem = ({
    item,
    index,
  }: {
    item: number;
    index: number;
  }) => (
    <View style={{width: wp('100%')}}>
      <Collapse
        onToggle={() => toggleCollapse(index)}
        isExpanded={openIndex === index}>
        <CollapseHeader
          style={[
            styles.accordionHeader,
            openIndex === index && {borderBottomRightRadius: 0},
          ]}>
          <TouchableOpacity
            style={styles.accordionHeaderContainer}
            onPress={() => toggleCollapse(index)}
            onLongPress={() => confirmDelete(item)}>
            <Text style={styles.accordionHeaderText}>Bendengan {item}</Text>
            {openIndex === index ? <AngleUpSvg /> : <AngleDownSvg />}
          </TouchableOpacity>
        </CollapseHeader>
        <CollapseBody style={styles.accordionBody}>
          <View>
            <Table>
              <Rows
                data={tableData}
                style={styles.row}
                textStyle={styles.text}
              />
            </Table>
          </View>
        </CollapseBody>
      </Collapse>
    </View>
  );

  const addBendengan = () => {
    setBendenganList([...bendenganList, bendenganList.length + 1]);
  };

  const renderContent = () => (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.suhuContainer}>
        <View>
          <Text style={styles.titleText}>Suhu saat ini</Text>
          <Text style={styles.tanggal}>{formatTanggal()}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.suhuUdara}>
            {currentWeatherData
              ? Math.round(currentWeatherData.main.temp)
              : '--'}
          </Text>
          <Text style={styles.suhuUdara}>°C</Text>
        </View>
      </View>
      <View style={styles.monitoringBendenganContainer}>
        <View>
          <Text style={styles.titleText}>Monitoring per Bendengan</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MapScreen')}>
            <Text style={styles.petaText}>Lihat peta</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={addBendengan}>
          <AddBendenganSvg />
        </TouchableOpacity>
      </View>
      <FlatList
        data={bendenganList}
        keyExtractor={item => item.toString()}
        renderItem={renderBendenganItem}
      />
    </View>
  );

  const renderBackground = useCallback(
    () => (
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          style={styles.gradient}
          colors={['#e0f8f0', '#fefefe', '#9bd5b6']}
          start={{x: 0, y: -0.25}}
          end={{x: 0.9, y: 0.8}}
          locations={[0.1, 0.5, 1]}
        />
      </View>
    ),
    [openIndex],
  );

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        index={0}
        snapPoints={snapPoints}
        backgroundComponent={renderBackground}
        style={styles.bottomSheet}>
        {renderContent()}
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
    alignItems: 'center',
    zIndex: 1,
    pointerEvents: 'box-none',
  },
  bottomSheet: {
    zIndex: 1,
    pointerEvents: 'box-none',
  },
  gradient: {
    flex: 1,
    borderRadius: wp('5%'),
    borderTopColor: '#E6E6E6',
  },
  suhuContainer: {
    height: hp('9.6%'),
    width: wp('100%'),
    paddingHorizontal: wp('5%'),
    marginTop: hp('-1.5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#bed1cb',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  titleText: {
    fontFamily: FontFamily.poppinsSemiBold,
    color: Color.PRIMARY,
    fontSize: wp('4%'),
  },
  tanggal: {
    fontFamily: FontFamily.poppinsMedium,
    color: Color.BLACK,
    fontSize: wp('3.2%'),
  },
  suhuUdara: {
    fontFamily: FontFamily.poppinsMedium,
    color: Color.BLACK,
    fontSize: wp('6%'),
  },
  monitoringBendenganContainer: {
    width: wp('100%'),
    paddingHorizontal: wp('5%'),
    paddingTop: hp('1.5%'),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  petaText: {
    fontFamily: FontFamily.poppinsMedium,
    color: Color.PRIMARY,
    fontSize: wp('3.2%'),
    textDecorationLine: 'underline',
    marginBottom: hp('1s%'),
  },
  accordionHeader: {
    backgroundColor: Color.PRIMARY,
    width: wp('90%'),
    height: hp('4%'),
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('3%'),
    borderTopRightRadius: wp('5%'),
    borderBottomRightRadius: wp('5%'),
    elevation: 5,
    marginVertical: hp('1%'),
  },
  accordionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionHeaderText: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: 12,
    color: Color.WHITE,
  },
  accordionBody: {
    backgroundColor: Color.WHITE,
    marginTop: hp('-1%'),
    width: wp('89.7%'),
    height: 'auto',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('3%'),
    borderBottomRightRadius: wp('5%'),
    elevation: 5,
  },
  row: {
    paddingHorizontal: wp('1%'),
    paddingVertical: hp('1%'),
  },
  text: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: 12,
    color: Color.PRIMARY,
  },
});

export default BottomSheets;
