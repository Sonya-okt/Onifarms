import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
} from 'react-native';
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
import AddbedenganSvg from '../../../components/svgFunComponent/monitoringScreenSvg/AddBendenganSvg';
import AngleUpSvg from '../../../components/svgFunComponent/monitoringScreenSvg/AngleUpSvg';
import AngleDownSvg from '../../../components/svgFunComponent/monitoringScreenSvg/AngleDownSvg';
import {getWeather, WeatherResponse} from '../../../components/api/OpenWeather';
import RNSecureStorage from 'rn-secure-storage';
import database from '@react-native-firebase/database';

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
  const [bedenganList, setbedenganList] = useState<number[]>([1]);
  const [currentWeatherData, setCurrentWeatherData] =
    useState<WeatherResponse | null>(weatherData);
  const [longitude, setLongitude] = useState<string>('');
  const [latitude, setLatitude] = useState<string>('');
  const [userUID, setUserUID] = useState<string | null>(null);

  // State untuk data bedengan
  const [bedenganData, setbedenganData] = useState<any>({});
  const [bedenganStatus, setbedenganStatus] = useState<{
    [key: number]: {longitudeButtonText: string; latitudeButtonText: string};
  }>({});
  const [bateraiData, setBateraiData] = useState<{
    [key: number]: {nodeKey: string; baterai: number}[];
  }>({});
  const [suhu, setSuhu] = useState<number>(0);
  const [kelembapan, setKelembapan] = useState<number>(0);
  const [ph, setPh] = useState<number>(0);
  const [nitrogen, setNitrogen] = useState<number>(0);
  const [phosphor, setPhosphor] = useState<number>(0);
  const [kalium, setKalium] = useState<number>(0);

  useEffect(() => {
    const getUserUID = async () => {
      const uid = await RNSecureStorage.getItem('userUID');
      setUserUID(uid);
      if (uid) {
        fetchbedenganData(uid);
      }
    };

    getUserUID();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      fetchCurrentWeather();
    }
  }, [selectedLocation]);

  useEffect(() => {
    setCurrentWeatherData(weatherData);
  }, [weatherData]);

  const fetchbedenganData = (uid: string) => {
    const bedenganRef = database().ref(`${uid}/Data`);
    bedenganRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        const bedenganKeys = Object.keys(data);
        const bedenganIndexes = bedenganKeys
          .map(key => parseInt(key.replace('bedengan', ''), 10))
          .sort((a, b) => a - b);
        setbedenganList(bedenganIndexes);
        setbedenganData(data);
      } else {
        setbedenganList([]);
        setbedenganData({});
      }
    });

    return () => bedenganRef.off();
  };

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

  const formatValue = (value: number): number => {
    return parseFloat(value.toFixed(2));
  };

  const fetchbedenganValues = (index: number) => {
    const path = `${userUID}/Data/bedengan${index}`;
    const bedenganRef = database().ref(path);
    bedenganRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        setSuhu(formatValue(data.suhu || 0));
        setKelembapan(formatValue(data.kelembapan || 0));
        setPh(formatValue(data.ph || 0));
        setNitrogen(formatValue(data.nitrogen || 0));
        setPhosphor(formatValue(data.phosphor || 0));
        setKalium(formatValue(data.kalium || 0));

        setLongitude(data.longitude || '');
        setLatitude(data.latitude || '');

        setbedenganStatus(
          (prevState: {
            [key: number]: {
              longitudeButtonText: string;
              latitudeButtonText: string;
            };
          }) => ({
            ...prevState,
            [index]: {
              longitudeButtonText: data.longitude ? 'Ubah' : 'Simpan',
              latitudeButtonText: data.latitude ? 'Ubah' : 'Simpan',
            },
          }),
        );

        // Fetch baterai data
        const nodeKeys = Object.keys(data).filter(key =>
          key.startsWith('node'),
        );
        const bateraiList = nodeKeys.map(nodeKey => ({
          nodeKey,
          baterai: data[nodeKey].baterai,
        }));

        bateraiList.sort((a, b) => {
          const nodeA = a.nodeKey.match(/(\d+)(?:_(\d+))?/);
          const nodeB = b.nodeKey.match(/(\d+)(?:_(\d+))?/);

          if (nodeA && nodeB) {
            const mainA = parseInt(nodeA[1], 10);
            const subA = nodeA[2] ? parseInt(nodeA[2], 10) : 0;
            const mainB = parseInt(nodeB[1], 10);
            const subB = nodeB[2] ? parseInt(nodeB[2], 10) : 0;

            if (mainA === mainB) {
              return subA - subB;
            }
            return mainA - mainB;
          }

          return 0;
        });

        setBateraiData(
          (prevState: {
            [key: number]: {nodeKey: string; baterai: number}[];
          }) => ({
            ...prevState,
            [index]: bateraiList,
          }),
        );
      } else {
        setSuhu(formatValue(0));
        setKelembapan(formatValue(0));
        setPh(formatValue(0));
        setNitrogen(formatValue(0));
        setPhosphor(formatValue(0));
        setKalium(formatValue(0));
        setLongitude('');
        setLatitude('');

        setbedenganStatus(
          (prevState: {
            [key: number]: {
              longitudeButtonText: string;
              latitudeButtonText: string;
            };
          }) => ({
            ...prevState,
            [index]: {
              longitudeButtonText: 'Simpan',
              latitudeButtonText: 'Simpan',
            },
          }),
        );

        setBateraiData(
          (prevState: {
            [key: number]: {nodeKey: string; baterai: number}[];
          }) => ({
            ...prevState,
            [index]: [],
          }),
        );
      }
    });

    return () => bedenganRef.off();
  };

  const toggleCollapse = (index: number) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
    if (index !== null) {
      fetchbedenganValues(index);
    }
  };

  const handleSaveOrUpdate = (
    index: number,
    type: 'longitude' | 'latitude',
  ) => {
    const path = `${userUID}/Data/bedengan${index}/${type}`;
    const value = type === 'longitude' ? longitude : latitude;

    if (bedenganStatus[index][`${type}ButtonText`] === 'Simpan') {
      database()
        .ref(path)
        .set(value)
        .then(() => {
          setbedenganStatus(prevState => ({
            ...prevState,
            [index]: {
              ...prevState[index],
              [`${type}ButtonText`]: 'Ubah',
            },
          }));
        })
        .catch(error => {
          console.error('Error saving data:', error);
        });
    } else {
      Alert.alert(
        'Konfirmasi Perubahan',
        `Apakah Anda yakin ingin mengubah ${type}?`,
        [
          {
            text: 'Batal',
            onPress: () => fetchbedenganValues(index),
            style: 'cancel',
          },
          {
            text: 'Ok',
            onPress: () => {
              database()
                .ref(path)
                .set(value)
                .then(() => {
                  Alert.alert('Data berhasil diubah');
                })
                .catch(error => {
                  console.error('Error updating data:', error);
                });
            },
          },
        ],
      );
    }
  };

  const confirmDelete = (item: number) => {
    Alert.alert(
      'Konfirmasi Penghapusan',
      `Apakah Anda yakin ingin menghapus Bedengan ${item}?`,
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          onPress: () => deletebedengan(item),
          style: 'destructive',
        },
      ],
    );
  };

  const deletebedengan = (item: number) => {
    if (userUID) {
      database()
        .ref(`${userUID}/Data/bedengan${item}`)
        .remove()
        .then(() => {
          setbedenganList(prevList =>
            prevList.filter(bedengan => bedengan !== item),
          );
        })
        .catch(error => {
          console.error('Error deleting bedengan:', error);
        });
    }
  };

  const addbedengan = () => {
    if (userUID) {
      const newIndex = bedenganList.length + 1;
      database()
        .ref(`${userUID}/Data/bedengan${newIndex}`)
        .set({
          suhu: 0,
          kelembapan: 0,
          ph: 0,
          nitrogen: 0,
          kalium: 0,
          longitude: '',
          latitude: '',
        })
        .then(() => {
          setbedenganList([...bedenganList, newIndex]);
        })
        .catch(error => {
          console.error('Error adding bedengan:', error);
        });
    }
  };

  const convertVoltageToPercentage = (voltage: number) => {
    if (voltage <= 3.3) return 0;
    if (voltage >= 4.1) return 100;
    return ((voltage - 3.3) / (4.1 - 3.3)) * 100;
  };

  const renderBedenganItem = ({item, index}: {item: number; index: number}) => (
    <View style={{width: wp('100%')}}>
      <Collapse
        onToggle={() => toggleCollapse(item)}
        isExpanded={openIndex === item}>
        <CollapseHeader
          style={[
            styles.accordionHeader,
            openIndex === item && {borderBottomRightRadius: 0},
          ]}>
          <TouchableOpacity
            style={styles.accordionHeaderContainer}
            onPress={() => toggleCollapse(item)}
            onLongPress={() => confirmDelete(item)}>
            <Text style={styles.accordionHeaderText}>Bedengan {item}</Text>
            {openIndex === item ? <AngleUpSvg /> : <AngleDownSvg />}
          </TouchableOpacity>
        </CollapseHeader>
        <CollapseBody style={styles.accordionBody}>
          <View style={styles.collapseBodyContainer}>
            <View style={styles.collapseBody}>
              <Text style={[styles.collapseBodyText]}>Longitude</Text>
              <Text style={styles.collapseBodyText2}>:</Text>

              <TextInput
                key={`longitude-${item}`}
                style={styles.input}
                value={longitude}
                onChangeText={setLongitude}
                placeholder="Isi longitude"
                placeholderTextColor={Color.PLACEHOLDER_TXT}
              />

              <TouchableOpacity
                onPress={() => handleSaveOrUpdate(item, 'longitude')}>
                <Text style={styles.longLatText}>
                  {bedenganStatus[item]?.longitudeButtonText || 'Simpan'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.collapseBody}>
              <Text style={[styles.collapseBodyText]}>Latitude</Text>
              <Text style={styles.collapseBodyText2}>:</Text>

              <TextInput
                key={`latitude-${item}`}
                style={styles.input}
                value={latitude}
                onChangeText={setLatitude}
                placeholder="Isi latitude"
                placeholderTextColor={Color.PLACEHOLDER_TXT}
              />
              <TouchableOpacity
                onPress={() => handleSaveOrUpdate(item, 'latitude')}>
                <Text style={styles.longLatText}>
                  {bedenganStatus[item]?.latitudeButtonText || 'Simpan'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.collapseBody}>
              <Text style={[styles.collapseBodyText]}>Suhu</Text>
              <Text style={styles.collapseBodyText2}>:</Text>
              <Text style={styles.collapseBodyText}>{suhu} °C</Text>
            </View>
            <View style={styles.collapseBody}>
              <Text style={[styles.collapseBodyText]}>Kelembapan</Text>
              <Text style={styles.collapseBodyText2}>:</Text>
              <Text style={styles.collapseBodyText}>{kelembapan} %</Text>
            </View>
            <View style={styles.collapseBody}>
              <Text style={[styles.collapseBodyText]}>pH</Text>
              <Text style={styles.collapseBodyText2}>:</Text>
              <Text style={styles.collapseBodyText}>{ph}</Text>
            </View>
            <View style={styles.collapseBody}>
              <Text style={[styles.collapseBodyText]}>Nitrogen</Text>
              <Text style={styles.collapseBodyText2}>:</Text>
              <Text style={styles.collapseBodyText}>{nitrogen} ppm</Text>
            </View>
            <View style={styles.collapseBody}>
              <Text style={[styles.collapseBodyText]}>Phosphor</Text>
              <Text style={styles.collapseBodyText2}>:</Text>
              <Text style={styles.collapseBodyText}>{phosphor} ppm</Text>
            </View>
            <View style={styles.collapseBody}>
              <Text style={styles.collapseBodyText}>Kalium</Text>
              <Text style={styles.collapseBodyText2}>:</Text>
              <Text style={styles.collapseBodyText}>{kalium} ppm</Text>
            </View>
            {bateraiData[item] && bateraiData[item].length > 0 && (
              <View>
                <Text style={styles.bateraiText}>Baterai</Text>
                <View style={styles.lineBaterai} />
                {bateraiData[item].map((node: any, nodeIndex: number) => (
                  <View style={styles.mapBaterai} key={nodeIndex}>
                    <Text style={styles.collapseBodyText}>
                      Node {node.nodeKey.replace('node', '')}
                    </Text>
                    <Text style={styles.collapseBodyText2}>:</Text>
                    <Text key={nodeIndex} style={styles.collapseBodyText}>
                      {convertVoltageToPercentage(node.baterai).toFixed(0)} %
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </CollapseBody>
      </Collapse>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.gradient}
        colors={['#e0f8f0', '#fefefe', '#bcddcb']}
        start={{x: 0, y: -0.25}}
        end={{x: 0.9, y: 0.8}}
        locations={[0.1, 0.5, 1]}>
        <View style={{}}>
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
          <View style={styles.monitoringbedenganContainer}>
            <View>
              <Text style={styles.titleText}>Monitoring per Bedengan</Text>
            </View>
            <TouchableOpacity onPress={addbedengan}>
              <AddbedenganSvg />
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={bedenganList}
          keyExtractor={item => item.toString()}
          renderItem={renderBedenganItem}
          contentContainerStyle={{paddingBottom: hp('12%')}} // Adding padding to avoid overlap
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
    pointerEvents: 'box-none',
    marginTop: hp('-4.5%'),
    marginBottom: hp('2.5%'),
    minHeight: hp('22%'),
    overflow: 'scroll',
  },
  gradient: {
    flex: 1,
    borderRadius: wp('5%'),
    borderTopColor: '#E6E6E6',
    paddingTop: hp('2%'),
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
  monitoringbedenganContainer: {
    width: wp('100%'),
    paddingHorizontal: wp('5%'),
    paddingTop: hp('1.5%'),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: hp('0.8%'),
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
  input: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: wp('3%'),
    color: Color.BLACK,
    width: wp('35%'),
    marginVertical: hp('-2%'),
  },
  longLatText: {
    color: Color.PRIMARY,
    textAlign: 'center',
    fontFamily: FontFamily.poppinsRegular,
    fontSize: wp('3%'),
  },
  collapseBodyContainer: {
    width: '100%',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('2%'),
  },
  collapseBody: {flexDirection: 'row', marginVertical: hp('1%')},
  collapseBodyText: {
    width: wp('25%'),
    color: Color.BLACK,
    fontFamily: FontFamily.poppinsRegular,
    fontSize: wp('3%'),
  },
  bateraiText: {
    width: wp('25%'),
    color: Color.BLACK,
    fontFamily: FontFamily.poppinsRegular,
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    marginVertical: hp('1%'),
  },
  lineBaterai: {
    width: '100%',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: hp('1%'),
  },
  collapseBodyText2: {
    marginHorizontal: wp('3%'),
    color: Color.BLACK,
    fontFamily: FontFamily.poppinsRegular,
    fontSize: wp('3%'),
  },
  mapBaterai: {flexDirection: 'row', marginBottom: hp('1%')},
});

export default BottomSheets;
