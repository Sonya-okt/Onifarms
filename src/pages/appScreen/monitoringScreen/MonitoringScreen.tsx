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
import firestore from '@react-native-firebase/firestore';
import {FlatList} from 'react-native-gesture-handler';
import RNSecureStorage from 'rn-secure-storage';

const MonitoringScreen: React.FC = () => {
  const [dayNightImage, setDayNightImage] = useState(
    require('../../../components/images/monitoringImage/monitoringDay.png'),
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState('Semarang');
  const [isTyping, setIsTyping] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
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

  const updateJumlahHari = (data: any) => {
    const startDates = Object.keys(data)
      .filter(key => key.startsWith('startDate'))
      .sort()
      .map(key => data[key]);
    const harvestDates = Object.keys(data)
      .filter(key => key.startsWith('harvestDate'))
      .sort()
      .map(key => data[key]);

    const today = new Date();
    let calculatedDays = 0;

    if (startDates.length > harvestDates.length) {
      const lastStartDate = new Date(startDates[startDates.length - 1]);
      const diffTime = today.getTime() - lastStartDate.getTime();
      calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    if (startDates.length === harvestDates.length) {
      calculatedDays = 0;
    }

    setJumlahHari(calculatedDays);
  };

  useEffect(() => {
    let firestoreUnsubscribe: (() => void) | undefined;
    let realtimeListeners: Array<() => void> = [];

    const updateJumlahHari = (data: any) => {
      const startDates = Object.keys(data)
        .filter(key => key.startsWith('startDate'))
        .sort()
        .map(key => data[key]);
      const harvestDates = Object.keys(data)
        .filter(key => key.startsWith('harvestDate'))
        .sort()
        .map(key => data[key]);

      const today = new Date();
      let calculatedDays = 0;

      if (startDates.length > harvestDates.length) {
        const lastStartDate = new Date(startDates[startDates.length - 1]);
        const diffTime = today.getTime() - lastStartDate.getTime();
        calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      if (startDates.length === harvestDates.length) {
        calculatedDays = 0;
      }

      setJumlahHari(calculatedDays);
    };

    const fetchData = async () => {
      try {
        const uid = await RNSecureStorage.getItem('userUID');
        if (uid) {
          // Firestore listener
          firestoreUnsubscribe = firestore()
            .collection(uid)
            .doc('plantHarvestDay')
            .onSnapshot(
              docSnapshot => {
                if (docSnapshot.exists) {
                  const data = docSnapshot.data();
                  if (data) {
                    updateJumlahHari(data);
                  }
                } else {
                  console.log('No plant harvest data available');
                  setJumlahHari(0);
                }
              },
              error => {
                console.error('Error fetching data from Firestore:', error);
              },
            );

          // Realtime Database listeners
          const setupRealtimeListener = (
            path: string,
            setState: React.Dispatch<React.SetStateAction<number>>,
            label: string,
            isPh: boolean = false,
          ) => {
            const ref = database().ref(`${uid}/${path}`);
            const onValueChange = (snapshot: any) => {
              if (snapshot.exists()) {
                const value = snapshot.val();
                const roundedValue = isPh
                  ? parseFloat(value.toFixed(1))
                  : Math.round(value);
                setState(roundedValue);
              } else {
                console.log(`${label} data not found`);
              }
            };
            ref.on('value', onValueChange);
            realtimeListeners.push(() => ref.off('value', onValueChange));
          };

          setupRealtimeListener('Average/suhu', setSuhu, 'Suhu');
          setupRealtimeListener(
            'Average/kelembapan',
            setKelembapan,
            'Kelembapan',
          );
          setupRealtimeListener('Average/ph', setPh, 'pH', true);
          setupRealtimeListener('Average/nitrogen', setNitrogen, 'Nitrogen');
          setupRealtimeListener('Average/phosphor', setPhosphor, 'Phosphor');
          setupRealtimeListener('Average/kalium', setKalium, 'Kalium');
        } else {
          console.log('No UID available, user might be logged out');
          setJumlahHari(0);
          setSuhu(0);
          setKelembapan(0);
          setPh(0);
          setNitrogen(0);
          setPhosphor(0);
          setKalium(0);
        }
      } catch (error) {
        console.error('Error fetching User UID:', error);
      }
    };

    fetchData();

    const logoutListener = EventRegister.addEventListener('logoutEvent', () => {
      if (firestoreUnsubscribe) {
        firestoreUnsubscribe();
      }
      realtimeListeners.forEach(unsubscribe => unsubscribe());
      setJumlahHari(0);
      setSuhu(0);
      setKelembapan(0);
      setPh(0);
      setNitrogen(0);
      setPhosphor(0);
      setKalium(0);
    });

    return () => {
      if (firestoreUnsubscribe) {
        firestoreUnsubscribe();
      }
      realtimeListeners.forEach(unsubscribe => unsubscribe());
      EventRegister.removeEventListener(logoutListener as string);
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
    <KeyboardAvoidingView style={{marginTop: hp('-2.3%')}}>
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={
          <View style={styles.viewContainer}>
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
                          <Text style={styles.monitoringNumber}>
                            {kelembapan}
                          </Text>
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
                            <Text
                              style={[styles.NPKText, {fontSize: hp('1.3%')}]}>
                              Nitrogen
                            </Text>
                            <View style={styles.numberNPKCircle}>
                              <MonitoringCircleSvg
                                fill="#D9D9D9"
                                style={styles.absolutePosition}
                              />
                              <Text style={styles.numberNPKText}>
                                {nitrogen}
                              </Text>
                            </View>
                            <Text
                              style={[styles.NPKText, {fontSize: hp('1.15%')}]}>
                              ppm
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tripleNPKKaliumPhosphor,
                              {left: '3%'},
                            ]}>
                            <Text
                              style={[styles.NPKText, {fontSize: hp('1.3%')}]}>
                              Kalium
                            </Text>
                            <View style={styles.numberNPKCircle}>
                              <MonitoringCircleSvg
                                fill="#D9D9D9"
                                style={styles.absolutePosition}
                              />
                              <Text style={styles.numberNPKText}>{kalium}</Text>
                            </View>
                            <Text
                              style={[styles.NPKText, {fontSize: hp('1.15%')}]}>
                              ppm
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.tripleNPKKaliumPhosphor,
                              {right: '3%'},
                            ]}>
                            <Text
                              style={[styles.NPKText, {fontSize: hp('1.3%')}]}>
                              Phosphor
                            </Text>
                            <View style={styles.numberNPKCircle}>
                              <MonitoringCircleSvg
                                fill="#D9D9D9"
                                style={styles.absolutePosition}
                              />
                              <Text style={styles.numberNPKText}>
                                {phosphor}
                              </Text>
                            </View>
                            <Text
                              style={[styles.NPKText, {fontSize: hp('1.15%')}]}>
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
          </View>
        }
        ListFooterComponent={
          <BottomSheets weatherData={weatherData} selectedLocation={location} />
        }
        contentContainerStyle={styles.contentContainerStyle}
      />
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  absolutePosition: {
    position: 'absolute',
  },
  viewContainer: {
    height: 'auto',
    width: wp('100%'),
    marginTop: hp('0.5%'),
  },
  contentContainerStyle: {
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
