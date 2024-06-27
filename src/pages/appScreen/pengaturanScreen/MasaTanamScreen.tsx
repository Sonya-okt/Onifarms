import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {Calendar} from 'react-native-calendars';
import {EventRegister} from 'react-native-event-listeners';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Color, FontFamily} from '../../../constants/GlobalStyles';
import MulaiTanamSvg from '../../../components/svgFunComponent/pengaturanSvg/MulaiTanamSvg';
import PanenSvg from '../../../components/svgFunComponent/pengaturanSvg/PanenSvg';

type DateObject = {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
};

const MasaTanamScreen: React.FC = () => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [harvestDate, setHarvestDate] = useState<string | null>(null);
  const [dates, setDates] = useState<{
    startDate: string[];
    harvestDate: string[];
  }>({startDate: [], harvestDate: []});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedDates = await AsyncStorage.getItem('dates');
        if (storedDates) {
          const parsedDates = JSON.parse(storedDates);
          setDates(parsedDates);
          setStartDate(parsedDates.startDate.slice(-1)[0] || null);
          setHarvestDate(parsedDates.harvestDate.slice(-1)[0] || null);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to load dates from storage', error);
      }
    };

    fetchData();
  }, []);

  const saveDates = async (dates: {
    startDate: string[];
    harvestDate: string[];
  }) => {
    try {
      await AsyncStorage.setItem('dates', JSON.stringify(dates));
      EventRegister.emit('datesChanged', dates);
    } catch (error) {
      console.error('Failed to save dates to storage', error);
    }
  };

  const onDayPress = (day: DateObject) => {
    const selectedDate = day.dateString;
    let newDates = {...dates};

    if (
      newDates.startDate.includes(selectedDate) ||
      newDates.harvestDate.includes(selectedDate)
    ) {
      Alert.alert(
        'Opsi',
        'Pilih opsi untuk tanggal ini',
        [
          {text: 'Hapus Mark', onPress: () => handleRemoveMark(selectedDate)},
          {text: 'Batal', style: 'cancel'},
        ],
        {cancelable: true},
      );
    } else {
      if (
        newDates.startDate.length === 0 ||
        (newDates.harvestDate.length >= 0 &&
          newDates.startDate.length === newDates.harvestDate.length)
      ) {
        newDates.startDate.push(selectedDate);
        setStartDate(selectedDate);
      } else if (newDates.startDate.length > newDates.harvestDate.length) {
        if (selectedDate > newDates.startDate[newDates.startDate.length - 1]) {
          newDates.harvestDate.push(selectedDate);
          setHarvestDate(selectedDate);
        } else {
          Alert.alert(
            'Logika Penanggalan Salah',
            'Tanggal panen harus setelah tanggal tanam.',
          );
          return;
        }
      } else {
        Alert.alert(
          'Logika Penanggalan Salah',
          'Silakan pilih tanggal yang benar.',
        );
        return;
      }

      setDates(newDates);
      saveDates(newDates);
    }
  };

  const handleRemoveMark = (date: string) => {
    let newDates = {...dates};

    newDates.startDate = newDates.startDate.filter(d => d !== date);
    newDates.harvestDate = newDates.harvestDate.filter(d => d !== date);

    setDates(newDates);
    saveDates(newDates);
    updateLastDates(newDates);
  };

  const updateLastDates = (newDates: {
    startDate: string[];
    harvestDate: string[];
  }) => {
    setStartDate(newDates.startDate.slice(-1)[0] || null);
    setHarvestDate(newDates.harvestDate.slice(-1)[0] || null);
  };

  const handleStartDatePress = () => {
    Alert.alert(
      'Pilih Tanggal',
      'Silakan pilih tanggal mulai tanam dari kalender.',
    );
  };

  const handleHarvestDatePress = () => {
    if (!startDate) {
      Alert.alert(
        'Peringatan',
        'Silakan pilih tanggal mulai tanam terlebih dahulu.',
      );
    } else {
      Alert.alert(
        'Pilih Tanggal',
        'Silakan pilih tanggal panen dari kalender.',
      );
    }
  };

  const getMarkedDates = () => {
    let markedDates: {[key: string]: any} = {};

    dates.startDate.forEach(date => {
      markedDates[date] = {selected: true, selectedColor: 'green'};
    });

    dates.harvestDate.forEach(date => {
      markedDates[date] = {selected: true, selectedColor: 'orange'};
    });

    return markedDates;
  };

  const renderMarkedDates = () => {
    const markedDates = getMarkedDates();
    for (let date in markedDates) {
      markedDates[date].onPress = () => {
        Alert.alert(
          'Opsi Tanggal',
          'Pilih opsi untuk tanggal ini',
          [
            {text: 'Hapus Mark', onPress: () => handleRemoveMark(date)},
            {text: 'Batal', style: 'cancel'},
          ],
          {cancelable: true},
        );
      };
    }
    return markedDates;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Color.PRIMARY} />
      </View>
    );
  }

  return (
    <LinearGradient
      style={styles.linearGradient}
      colors={['#E0F8F0', '#FFFFFF', '#9BD5B5']}
      start={{x: 0, y: -0.4}}
      end={{x: 0.9, y: 1.5}}
      locations={[0.1, 0.5, 1]}>
      <View style={styles.container}>
        <Calendar
          style={styles.calendarStyle}
          onDayPress={onDayPress}
          markedDates={renderMarkedDates()}
          theme={{
            todayTextColor: Color.GREEN,
            textDayFontFamily: FontFamily.poppinsRegular,
            textMonthFontFamily: FontFamily.poppinsSemiBold,
            arrowColor: Color.PRIMARY,
            textDayHeaderFontFamily: FontFamily.poppinsSemiBold,
          }}
        />

        <TouchableOpacity
          style={[styles.mulaiTanamContainer, {borderColor: Color.PRIMARY}]}
          onPress={handleStartDatePress}>
          <MulaiTanamSvg />
          <View style={styles.mulaiTanamTextContainer}>
            <Text style={[styles.mulaiTanamText, {color: Color.PRIMARY}]}>
              Mulai Tanam
            </Text>
            <Text
              style={[styles.mulaiTanamTextTanggal, {color: Color.PRIMARY}]}>
              {startDate || '-'}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.mulaiTanamContainer,
            {borderColor: Color.YELLOW_MASTAM},
          ]}
          onPress={handleHarvestDatePress}>
          <PanenSvg />
          <View style={styles.mulaiTanamTextContainer}>
            <Text style={[styles.mulaiTanamText, {color: Color.YELLOW_MASTAM}]}>
              Panen
            </Text>
            <Text
              style={[
                styles.mulaiTanamTextTanggal,
                {color: Color.YELLOW_MASTAM},
              ]}>
              {dates.startDate.length > dates.harvestDate.length
                ? '-'
                : harvestDate || '-'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp('100%'),
    width: wp('100%'),
    paddingTop: hp('5%'),
    borderWidth: wp('0.1%'),
    borderColor: Color.PRIMARY,
  },
  linearGradient: {
    flex: 1,
    borderWidth: wp('0.1%'),
    borderColor: Color.PRIMARY,
    alignItems: 'center',
    marginTop: hp('-2%'),
  },
  masaTanamText: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: 16,
    color: Color.PRIMARY,
    textAlign: 'center',
    marginVertical: hp('3%'),
  },
  calendarStyle: {
    width: wp('85%'),
    alignSelf: 'center',
    borderRadius: wp('3%'),
    borderWidth: wp('0.3%'),
    borderColor: Color.PRIMARY,
    marginBottom: hp('3%'),
  },
  mulaiTanamButton: {
    backgroundColor: Color.PRIMARY,
    borderRadius: wp('3.5%'),
    width: wp('26%'),
    height: hp('4.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: hp('2.5%'),
  },
  mulaiTanamButtonText: {
    fontFamily: FontFamily.poppinsMedium,
    color: Color.WHITE,
    fontSize: 12,
  },
  mulaiTanamContainer: {
    borderRadius: wp('2%'),
    borderWidth: wp('0.3%'),
    elevation: 3,
    gap: wp('3%'),
    backgroundColor: Color.WHITE,
    alignSelf: 'center',
    width: wp('85%'),
    height: hp('9%'),
    paddingHorizontal: wp('3%'),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: wp('5%'),
    justifyContent: 'flex-start',
  },
  mulaiTanamTextContainer: {},
  mulaiTanamText: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: wp('3.8%'),
  },
  mulaiTanamTextTanggal: {
    fontFamily: FontFamily.poppinsBold,
    fontSize: wp('3.5%'),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MasaTanamScreen;
