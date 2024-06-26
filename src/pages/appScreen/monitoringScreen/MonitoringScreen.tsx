import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  Button,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Color, FontFamily} from '../../../constants/GlobalStyles';
import MonitoringCircleSvg from '../../../components/svgFunComponent/monitoringScreenSvg/CircleSvg';
import MonitoringMarkerLoc from '../../../components/svgFunComponent/monitoringScreenSvg/MonitoringMarkerLoc';
import BottomSheets from './BottomSheets';
import LocationSearch, {
  WeatherResponse,
} from '../../../components/api/OpenWeather';
import {EventRegister} from 'react-native-event-listeners';
import database from '@react-native-firebase/database';

const MonitoringScreen: React.FC = () => {
  const [dayNightImage, setDayNightImage] = useState(
    require('../../../components/images/monitoringImage/monitoringDay.png'),
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState('Tembalang');
  const [isTyping, setIsTyping] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [harvestDate, setHarvestDate] = useState<string | null>(null);
  const [jumlahHari, setJumlahHari] = useState<number>(0);

  const [suhu, setSuhu] = useState<number>(0);
  const [kelembapan, setKelembapan] = useState<number>(0);
  const [ph, setPh] = useState<number>(0);
  const [nitrogen, setNitrogen] = useState<number>(0);
  const [phosphor, setPhosphor] = useState<number>(0);
  const [kalium, setKalium] = useState<number>(0);

  useEffect(() => {
    const updateImageBasedOnTime = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 6 && currentHour < 18) {
        setDayNightImage(
          require('../../../components/images/monitoringImage/monitoringDay.png'),
        );
      } else {
        setDayNightImage(
          require('../../../components/images/monitoringImage/monitoringNight.png'),
        );
      }
    };

    updateImageBasedOnTime();
    const interval = setInterval(updateImageBasedOnTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const fetchStoredData = async () => {
    try {
      const storedLocation = await AsyncStorage.getItem('location');
      const storedDates = await AsyncStorage.getItem('dates');

      if (storedLocation) {
        setLocation(storedLocation);
      }

      if (storedDates) {
        const parsedDates = JSON.parse(storedDates);
        setStartDate(parsedDates.startDate.slice(-1)[0] || null);
        setHarvestDate(parsedDates.harvestDate.slice(-1)[0] || null);
        updateJumlahHari(parsedDates);
      }
    } catch (error) {
      console.error('Error fetching stored data:', error);
    }
  };

  const updateJumlahHari = (dates: {
    startDate: string[];
    harvestDate: string[];
  }) => {
    const today = new Date();
    let calculatedDays = 0;

    for (let i = 0; i < dates.startDate.length; i++) {
      const start = new Date(dates.startDate[i]);
      const harvest = dates.harvestDate[i]
        ? new Date(dates.harvestDate[i])
        : null;

      if (!harvest || today < harvest) {
        const diffTime = today.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        calculatedDays += diffDays;
      } else {
        calculatedDays = 0;
      }
    }

    setJumlahHari(calculatedDays);
  };

  useEffect(() => {
    fetchStoredData();

    const handleDatesChanged = (dates: {
      startDate: string[];
      harvestDate: string[];
    }) => {
      setStartDate(dates.startDate.slice(-1)[0] || null);
      setHarvestDate(dates.harvestDate.slice(-1)[0] || null);
      updateJumlahHari(dates);
    };

    const listener = EventRegister.on(
      'datesChanged',
      handleDatesChanged,
    ) as string;

    return () => {
      EventRegister.rm(listener);
    };
  }, [startDate, harvestDate]);

  useEffect(() => {
    const suhuRef = database().ref('1002/Average/suhu');
    const kelembapanRef = database().ref('1002/Average/kelembapan');
    const phRef = database().ref('1002/Average/ph');
    const nitrogenRef = database().ref('1002/Average/nitrogen');
    const phosphorRef = database().ref('1002/Average/phosphor');
    const kaliumRef = database().ref('1002/Average/kalium');

    const onValueChange = (
      snapshot: any,
      setState: React.Dispatch<React.SetStateAction<number>>,
      label: string,
    ) => {
      if (snapshot.exists()) {
        setState(snapshot.val());
        console.log(`${label} data: `, snapshot.val());
      } else {
        console.log(`${label} data not found`);
      }
    };

    const suhuListener = suhuRef.on('value', snapshot =>
      onValueChange(snapshot, setSuhu, 'Suhu'),
    );
    const kelembapanListener = kelembapanRef.on('value', snapshot =>
      onValueChange(snapshot, setKelembapan, 'Kelembapan'),
    );
    const phListener = phRef.on('value', snapshot =>
      onValueChange(snapshot, setPh, 'pH'),
    );
    const nitrogenListener = nitrogenRef.on('value', snapshot =>
      onValueChange(snapshot, setNitrogen, 'Nitrogen'),
    );
    const phosphorListener = phosphorRef.on('value', snapshot =>
      onValueChange(snapshot, setPhosphor, 'Phosphor'),
    );
    const kaliumListener = kaliumRef.on('value', snapshot =>
      onValueChange(snapshot, setKalium, 'Kalium'),
    );

    return () => {
      suhuRef.off('value', suhuListener);
      kelembapanRef.off('value', kelembapanListener);
      phRef.off('value', phListener);
      nitrogenRef.off('value', nitrogenListener);
      phosphorRef.off('value', phosphorListener);
      kaliumRef.off('value', kaliumListener);
    };
  }, []);

  const handleLocationSelect = async (
    item: any,
    weatherData: WeatherResponse | null,
  ) => {
    const locality =
      item.address.village || item.address.town || item.address.city;
    const adminArea =
      item.address.county || item.address.state || item.address.region;

    let selectedLocation = '';
    if (locality && adminArea) {
      selectedLocation = `${locality}, ${adminArea}`;
    } else {
      selectedLocation = item.display_name;
    }
    setLocation(selectedLocation);
    setWeatherData(weatherData);
    setModalVisible(false);

    storeLocation(selectedLocation);
  };

  const storeLocation = async (location: string) => {
    try {
      await AsyncStorage.setItem('location', location);
    } catch (error) {
      console.error('Error storing location:', error);
    }
  };

  return (
    <KeyboardAvoidingView>
      <View style={styles.viewContainer}>
        <BottomSheets weatherData={weatherData} selectedLocation={location} />
        <View style={styles.monitoringContainer}>
          <ImageBackground
            source={require('../../../components/images/monitoringImage/monitoringFieldImage.png')}
            resizeMode="cover"
            style={styles.sawahField}>
            <View style={styles.topLocationMasaTanam}>
              <TouchableOpacity
                style={styles.topLocation}
                onPress={() => setModalVisible(true)}>
                <MonitoringMarkerLoc />
                <Text style={styles.topText}>{location}</Text>
              </TouchableOpacity>
              <Image
                source={dayNightImage}
                resizeMode="contain"
                style={styles.dayNightImage}
              />
              <View style={styles.topMonitoring}>
                <Text style={styles.textUsiaTanam}>Usia Tanam :</Text>
                <View style={styles.textUsiaTanamHari}>
                  <Text style={styles.textJumlahHari}>{jumlahHari}</Text>
                  <Text style={styles.textHari}>HST</Text>
                </View>
              </View>
            </View>
            <View style={styles.monitoringNumContainer}>
              <View style={[styles.lineCenter, styles.lineVertical]} />
              <View style={[styles.lineCenter, styles.lineHorizontal]} />
              <View style={styles.insideMonitoringContainer}>
                <View style={styles.dividerMonitoringContainer}>
                  <View style={styles.miniMonitoringContainer}>
                    <Text style={styles.monitoringText}>Suhu Tanah</Text>
                    <View style={styles.svgWrapper}>
                      <MonitoringCircleSvg
                        fill="#D9D9D9"
                        style={styles.absolutePosition}
                      />
                      <Text style={styles.monitoringNumber}>{suhu}</Text>
                      <Text style={styles.monitoringUnit}>°C</Text>
                    </View>
                  </View>
                  <View style={styles.miniMonitoringContainer}>
                    <Text style={styles.monitoringText}>Kelembapan</Text>
                    <View style={styles.svgWrapper}>
                      <MonitoringCircleSvg
                        fill="#D9D9D9"
                        style={styles.absolutePosition}
                      />
                      <Text style={styles.monitoringNumber}>{kelembapan}</Text>
                      <Text style={styles.monitoringUnit}>%</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.dividerMonitoringContainer}>
                  <View style={styles.miniMonitoringContainer}>
                    <Text style={styles.monitoringText}>pH</Text>
                    <View style={styles.svgWrapper}>
                      <MonitoringCircleSvg
                        fill="#D9D9D9"
                        style={styles.absolutePosition}
                      />
                      <Text style={styles.monitoringNumber}>{ph}</Text>
                    </View>
                  </View>
                  <View style={styles.miniMonitoringContainer}>
                    <Text style={styles.monitoringText}>NPK</Text>
                    <View style={styles.tripleNPKContainer}>
                      <View style={styles.tripleNPKNitrogen}>
                        <Text style={[styles.NPKText, {fontSize: hp('1.3%')}]}>
                          Nitrogen
                        </Text>
                        <View style={styles.numberNPKCircle}>
                          <MonitoringCircleSvg
                            fill="#D9D9D9"
                            style={styles.absolutePosition}
                          />
                          <Text style={styles.numberNPKText}>{nitrogen}</Text>
                        </View>
                        <Text style={[styles.NPKText, {fontSize: hp('1.15%')}]}>
                          ppm
                        </Text>
                      </View>
                      <View
                        style={[styles.tripleNPKKaliumPhosphor, {left: '3%'}]}>
                        <Text style={[styles.NPKText, {fontSize: hp('1.3%')}]}>
                          Kalium
                        </Text>
                        <View style={styles.numberNPKCircle}>
                          <MonitoringCircleSvg
                            fill="#D9D9D9"
                            style={styles.absolutePosition}
                          />
                          <Text style={styles.numberNPKText}>{kalium}</Text>
                        </View>
                        <Text style={[styles.NPKText, {fontSize: hp('1.15%')}]}>
                          ppm
                        </Text>
                      </View>
                      <View
                        style={[styles.tripleNPKKaliumPhosphor, {right: '3%'}]}>
                        <Text style={[styles.NPKText, {fontSize: hp('1.3%')}]}>
                          Phosphor
                        </Text>
                        <View style={styles.numberNPKCircle}>
                          <MonitoringCircleSvg
                            fill="#D9D9D9"
                            style={styles.absolutePosition}
                          />
                          <Text style={styles.numberNPKText}>{phosphor}</Text>
                        </View>
                        <Text style={[styles.NPKText, {fontSize: hp('1.15%')}]}>
                          ppm
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <LocationSearch
              onSelect={handleLocationSelect}
              onChangeQuery={setIsTyping}
            />
            {!isTyping && (
              <Button
                title="Cancel"
                color={Color.PRIMARY}
                onPress={() => {
                  setIsTyping(false);
                  setModalVisible(false);
                  Keyboard.dismiss();
                }}
              />
            )}
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  absolutePosition: {
    position: 'absolute',
  },
  viewContainer: {
    marginTop: hp('-2%'),
    height: hp('100%'),
    width: wp('100%'),
    alignItems: 'center',
  },
  topMonitoring: {
    height: '65%',
    width: '40%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  textUsiaTanam: {
    fontFamily: FontFamily.poppinsMedium,
    width: '100%',
    color: 'black',
    textAlign: 'right',
    fontSize: hp('1.45%'),
  },
  textUsiaTanamHari: {
    height: '60%',
    width: '100%',
    flexDirection: 'row',
  },
  textJumlahHari: {
    fontFamily: FontFamily.poppinsMedium,
    right: '18%',
    color: 'black',
    textAlign: 'right',
    fontSize: hp('2.5%'),
    position: 'absolute',
  },
  textHari: {
    fontFamily: FontFamily.poppinsMedium,
    right: 0,
    bottom: 0,
    color: 'black',
    textAlign: 'right',
    fontSize: hp('1.35%'),
    position: 'absolute',
  },
  monitoringContainer: {
    top: 0,
    width: wp('100%'),
    height: hp('72%'),
    overflow: 'hidden',
  },
  sawahField: {
    width: wp('100%'),
    height: hp('90%'),
  },
  topLocationMasaTanam: {
    top: hp('1.8%'),
    width: wp('100%'),
    height: hp('8%'),
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    paddingHorizontal: wp('6%'),
  },
  monitoringNumContainer: {
    top: hp('2.2%'),
    width: wp('87%'),
    height: hp('55%'),
    alignSelf: 'center',
    backgroundColor: Color.GREENMONITORINGALL,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('4%'),
  },
  lineCenter: {
    borderColor: Color.WHITE,
    borderWidth: 0.8,
    position: 'absolute',
  },
  lineVertical: {
    height: '93%',
    width: 0,
    left: '50%',
    marginVertical: '8%',
  },
  lineHorizontal: {
    width: '93%',
    height: 0,
    top: '50%',
    marginHorizontal: '5%',
  },
  insideMonitoringContainer: {
    height: '100%',
    width: '100%',
  },
  dividerMonitoringContainer: {
    height: '50%',
    width: '100%',
    flexDirection: 'row',
  },
  miniMonitoringContainer: {
    height: '100%',
    width: '50%',
    alignItems: 'center',
  },
  svgWrapper: {
    top: '17%',
    left: '0%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: '60%',
  },
  monitoringText: {
    top: '8%',
    fontFamily: FontFamily.poppinsSemiBold,
    fontWeight: 'bold',
    fontSize: wp('3.6%'),
    color: Color.WHITE,
  },
  monitoringNumber: {
    width: '95%',
    marginTop: '6%',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: hp('6%'),
    fontFamily: FontFamily.poppinsRegular,
    color: 'black',
  },
  monitoringUnit: {
    top: '0%',
    right: '0%',
    fontSize: hp('2.3%'),
    fontFamily: FontFamily.poppinsRegular,
    color: 'white',
    position: 'absolute',
  },
  tripleNPKContainer: {
    top: '10%',
    width: '95%',
    height: '70%',
  },
  tripleNPKNitrogen: {
    width: '40%',
    height: '50%',
    alignSelf: 'center',
  },
  NPKText: {
    fontFamily: FontFamily.poppinsMedium,
    color: 'white',
    textAlign: 'center',
    paddingBottom: '5%',
  },
  numberNPKCircle: {
    width: '100%',
    height: '60%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberNPKText: {
    width: '95%',
    textAlign: 'center',
    fontSize: hp('1.8%'),
    fontFamily: FontFamily.poppinsBold,
    fontWeight: 'bold',
    color: 'black',
  },
  tripleNPKKaliumPhosphor: {
    bottom: '-4%',
    width: '40%',
    height: '50%',
    position: 'absolute',
  },
  dayNightImage: {
    height: '57%',
    width: '15%',
  },
  topLocation: {
    height: '30%',
    width: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  topText: {
    width: '90%',
    fontFamily: FontFamily.poppinsMedium,
    color: 'black',
    textAlign: 'left',
    marginLeft: '1.5%',
    fontSize: hp('1.45%'),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default MonitoringScreen;
