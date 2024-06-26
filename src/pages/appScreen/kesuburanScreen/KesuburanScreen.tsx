import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {Color, FontFamily} from '../../../constants/GlobalStyles';
import HighIndicator from '../../../components/svgFunComponent/kesuburanScreenSvg/HighIndicator';
import LowIndicator from '../../../components/svgFunComponent/kesuburanScreenSvg/LowIndicator';
import NormalIndicator from '../../../components/svgFunComponent/kesuburanScreenSvg/NormalIndicator';
import database from '@react-native-firebase/database';

const KesuburanScreen: React.FC = () => {
  const scrollViewRef = useRef<FlatList | null>(null);

  type Conditions = {
    suhu: 'Rendah' | 'Normal' | 'Tinggi';
    kelembapan: 'Rendah' | 'Normal' | 'Tinggi';
    pH: 'Rendah' | 'Normal' | 'Tinggi';
    nitrogen: 'Rendah' | 'Normal' | 'Tinggi';
    phosphor: 'Rendah' | 'Normal' | 'Tinggi';
    kalium: 'Rendah' | 'Normal' | 'Tinggi';
  };

  const conditionRanges = {
    suhu: {Rendah: '<25 °C', Normal: '25 - 32 °C', Tinggi: '>32 °C'},
    kelembapan: {Rendah: '<50 %', Normal: '50 - 70 %', Tinggi: '70 - 100 %'},
    pH: {Rendah: '<5.6', Normal: '5.6 - 6.5', Tinggi: '6.5 - 14'},
    nitrogen: {
      Rendah: '<155 ppm',
      Normal: '155 - 250 ppm',
      Tinggi: '>250 ppm',
    },
    phosphor: {
      Rendah: '<6.1 ppm',
      Normal: '6.1 - 12.2 ppm',
      Tinggi: '>12.2 ppm',
    },
    kalium: {
      Rendah: '<65.5 ppm',
      Normal: '65.5 - 155.5 ppm',
      Tinggi: '>155.5 ppm',
    },
  };

  const getStatus = (
    value: number,
    type: keyof typeof conditionRanges,
  ): 'Rendah' | 'Normal' | 'Tinggi' => {
    const ranges = {
      suhu: {Rendah: [0, 25], Normal: [25, 32], Tinggi: [32, Infinity]},
      kelembapan: {Rendah: [0, 50], Normal: [50, 70], Tinggi: [70, 100]},
      pH: {Rendah: [0, 5.6], Normal: [5.6, 6.5], Tinggi: [6.5, 14]},
      nitrogen: {Rendah: [0, 155], Normal: [155, 250], Tinggi: [250, Infinity]},
      phosphor: {
        Rendah: [0, 6.1],
        Normal: [6.1, 12.2],
        Tinggi: [12.2, Infinity],
      },
      kalium: {
        Rendah: [0, 65.5],
        Normal: [65.5, 155.5],
        Tinggi: [155.5, Infinity],
      },
    };

    const range = ranges[type];
    if (value < range.Rendah[1]) {
      return 'Rendah';
    } else if (value <= range.Normal[1]) {
      return 'Normal';
    }
    return 'Tinggi';
  };

  const [conditions, setConditions] = useState<Conditions>({
    suhu: getStatus(35, 'suhu'),
    kelembapan: getStatus(80, 'kelembapan'),
    pH: getStatus(6.5, 'pH'),
    nitrogen: getStatus(225, 'nitrogen'),
    phosphor: getStatus(2000, 'phosphor'),
    kalium: getStatus(225, 'kalium'),
  });

  const calculatePercentage = (conditions: Conditions): number => {
    const weights = {
      Rendah: 25,
      Normal: 100,
      Tinggi: 25,
    };

    const totalWeight = Object.values(conditions).reduce(
      (total, condition) => total + weights[condition],
      0,
    );

    const percentage = totalWeight / 6;

    return Math.round(percentage);
  };

  const data = [
    {
      key: 'Suhu',
      status: conditions.suhu,
      range: conditionRanges.suhu[conditions.suhu],
    },
    {
      key: 'Kelembapan',
      status: conditions.kelembapan,
      range: conditionRanges.kelembapan[conditions.kelembapan],
    },
    {
      key: 'pH',
      status: conditions.pH,
      range: conditionRanges.pH[conditions.pH],
    },
    {
      key: 'Nitrogen',
      status: conditions.nitrogen,
      range: conditionRanges.nitrogen[conditions.nitrogen],
    },
    {
      key: 'Phosphor',
      status: conditions.phosphor,
      range: conditionRanges.phosphor[conditions.phosphor],
    },
    {
      key: 'Kalium',
      status: conditions.kalium,
      range: conditionRanges.kalium[conditions.kalium],
    },
  ];

  const renderItem = ({
    item,
  }: {
    item: {key: string; status: string; range: string};
  }) => (
    <View style={styles.listItem}>
      <Text style={[styles.listItemText, {width: wp('25%')}]}>{item.key}</Text>
      <Text style={[styles.listItemText, {width: wp('5%')}]}>:</Text>
      <Text style={[styles.listItemText, {width: wp('30%')}]}>
        {item.range}
      </Text>
    </View>
  );

  const getIndicator = (condition: 'Rendah' | 'Normal' | 'Tinggi') => {
    if (condition === 'Tinggi') return <HighIndicator />;
    if (condition === 'Rendah') return <LowIndicator />;
    return <NormalIndicator />;
  };

  const getIndicatorStyle = (condition: 'Rendah' | 'Normal' | 'Tinggi') => {
    if (condition === 'Tinggi') return styles.redCircleIndicator;
    if (condition === 'Rendah') return styles.orangeCircleIndicator;
    return styles.greenCircleIndicator;
  };

  useEffect(() => {
    const suhuRef = database().ref('1002/Average/suhu');
    const kelembapanRef = database().ref('1002/Average/kelembapan');
    const phRef = database().ref('1002/Average/ph');
    const nitrogenRef = database().ref('1002/Average/nitrogen');
    const phosphorRef = database().ref('1002/Average/phosphor');
    const kaliumRef = database().ref('1002/Average/kalium');

    const onValueChange = (snapshot: any, type: keyof Conditions) => {
      if (snapshot.exists()) {
        const value = snapshot.val();
        setConditions(prev => ({...prev, [type]: getStatus(value, type)}));
        console.log(`${type} data: `, value);
      } else {
        console.log(`${type} data not found`);
      }
    };

    const suhuListener = suhuRef.on('value', snapshot =>
      onValueChange(snapshot, 'suhu'),
    );
    const kelembapanListener = kelembapanRef.on('value', snapshot =>
      onValueChange(snapshot, 'kelembapan'),
    );
    const phListener = phRef.on('value', snapshot =>
      onValueChange(snapshot, 'pH'),
    );
    const nitrogenListener = nitrogenRef.on('value', snapshot =>
      onValueChange(snapshot, 'nitrogen'),
    );
    const phosphorListener = phosphorRef.on('value', snapshot =>
      onValueChange(snapshot, 'phosphor'),
    );
    const kaliumListener = kaliumRef.on('value', snapshot =>
      onValueChange(snapshot, 'kalium'),
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

  return (
    <LinearGradient
      style={styles.linearGradient}
      colors={['#E0F8F0', '#FFFFFF', '#9BD5B5']}
      start={{x: 0, y: -0.4}}
      end={{x: 0.9, y: 1.5}}
      locations={[0.1, 0.5, 1]}>
      <FlatList
        ref={scrollViewRef}
        ListHeaderComponent={
          <>
            <View style={styles.percentageIndicatorContainer}>
              <View style={styles.percentageContainer}>
                <Text style={styles.percentageTextNum}>
                  {calculatePercentage(conditions)}
                </Text>
                <Text style={styles.percentageText}>%</Text>
              </View>
              <View style={styles.indicatorContainer}>
                <View style={styles.childIndicatorContainer}>
                  <View style={styles.redIndicator} />
                  <Text style={styles.redIndicatorText}>Tinggi</Text>
                </View>
                <View style={styles.childIndicatorContainer}>
                  <View style={styles.orangeIndicator} />
                  <Text style={styles.orangeIndicatorText}>Rendah</Text>
                </View>
                <View style={styles.childIndicatorContainer}>
                  <View style={styles.greenIndicator} />
                  <Text style={styles.greenIndicatorText}>Normal</Text>
                </View>
              </View>
            </View>
            <View style={styles.tableIndicatorContainer}>
              <View style={styles.childTableIndicator}>
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.textIndicator}>Suhu</Text>
                  <View style={getIndicatorStyle(conditions.suhu)}>
                    {getIndicator(conditions.suhu)}
                  </View>
                </View>
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.textIndicator}>Kelembapan</Text>
                  <View style={getIndicatorStyle(conditions.kelembapan)}>
                    {getIndicator(conditions.kelembapan)}
                  </View>
                </View>
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.textIndicator}>pH</Text>
                  <View style={getIndicatorStyle(conditions.pH)}>
                    {getIndicator(conditions.pH)}
                  </View>
                </View>
              </View>
              <View style={[styles.lineCenter]} />
              <View style={styles.childTableIndicator}>
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.textIndicator}>Nitrogen</Text>
                  <View style={getIndicatorStyle(conditions.nitrogen)}>
                    {getIndicator(conditions.nitrogen)}
                  </View>
                </View>
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.textIndicator}>Phosphor</Text>
                  <View style={getIndicatorStyle(conditions.phosphor)}>
                    {getIndicator(conditions.phosphor)}
                  </View>
                </View>
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.textIndicator}>Kalium</Text>
                  <View style={getIndicatorStyle(conditions.kalium)}>
                    {getIndicator(conditions.kalium)}
                  </View>
                </View>
              </View>
            </View>
          </>
        }
        ListFooterComponent={
          <View style={{alignSelf: 'center'}}>
            <View style={styles.rentangNilaiTag}>
              <Text style={styles.rentangNilaiTagText}>Rentang nilai</Text>
            </View>
            <View style={styles.rentangNilaiContainer}>
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.key}
                contentContainerStyle={styles.list}
              />
            </View>
          </View>
        }
        data={[]}
        renderItem={null}
        keyExtractor={(_, index) => index.toString()}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  scrollViewStyle: {
    flexGrow: 1,
    alignItems: 'center',
  },
  linearGradient: {
    flex: 1,
    marginTop: hp('-2%'),
    paddingTop: hp('2%'),
    alignItems: 'center',
  },
  percentageIndicatorContainer: {
    alignItems: 'center',
    marginTop: hp('1.5 %'),
    width: wp('100%'),
    height: hp('30%'),
    marginBottom: hp('2%'),
  },
  percentageContainer: {
    width: wp('50%'),
    height: hp('24%'),
    aspectRatio: 1,
    backgroundColor: Color.WHITE,
    borderColor: Color.PRIMARY,
    borderRadius: wp('100%'),
    borderWidth: wp('0.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    flexDirection: 'row',
  },
  percentageCircle: {
    borderColor: Color.PRIMARY,
    borderWidth: wp('0.5%'),
  },
  percentageTextNum: {
    fontSize: wp('18%'),
    marginTop: hp('2%'),
    fontFamily: FontFamily.poppinsLight,
    color: Color.PRIMARY,
    textAlign: 'center',
  },
  percentageText: {
    fontSize: wp('7%'),
    fontWeight: '500',
    color: Color.PRIMARY,
    fontFamily: FontFamily.poppinsLight,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('5%'),
    marginVertical: hp('3%'),
  },
  childIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
  },
  redIndicator: {
    backgroundColor: Color.RED_WARN,
    width: wp('6%'),
    height: hp('1%'),
    borderRadius: wp('10%'),
  },
  redIndicatorText: {
    color: Color.RED_WARN,
    fontFamily: FontFamily.poppinsMedium,
    fontSize: 10,
  },
  orangeIndicator: {
    backgroundColor: Color.ORANGE_WARN,
    width: wp('6%'),
    height: hp('1%'),
    borderRadius: wp('10%'),
  },
  orangeIndicatorText: {
    color: Color.ORANGE_WARN,
    fontFamily: FontFamily.poppinsMedium,
    fontSize: 10,
  },
  greenIndicator: {
    backgroundColor: Color.NORMAL_WARN,
    width: wp('6%'),
    height: hp('1%'),
    borderRadius: wp('10%'),
  },
  greenIndicatorText: {
    color: Color.NORMAL_WARN,
    fontFamily: FontFamily.poppinsMedium,
    fontSize: 10,
  },
  lineCenter: {
    borderBottomWidth: wp('0.2%'),
    marginVertical: hp('1.5%'),
    color: Color.PRIMARY,
  },
  tableIndicatorContainer: {
    width: wp('90%'),
    height: hp('27%'),
    borderColor: Color.PRIMARY,
    borderWidth: wp('0.3%'),
    borderRadius: wp('3%'),
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('5%'),
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: hp('2%'),
  },
  childTableIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    gap: wp('8%'),
  },
  textIndicator: {
    fontFamily: FontFamily.poppinsBold,
    fontSize: 11.5,
    color: Color.PRIMARY,
    marginBottom: hp('0.5%'),
  },
  redCircleIndicator: {
    backgroundColor: Color.RED_WARN,
    width: wp('14%'),
    height: hp('6.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('100%'),
  },
  orangeCircleIndicator: {
    backgroundColor: Color.ORANGE_WARN,
    width: wp('14%'),
    height: hp('6.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('100%'),
  },
  greenCircleIndicator: {
    backgroundColor: Color.NORMAL_WARN,
    width: wp('14%'),
    height: hp('6.5%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('100%'),
  },
  rentangNilaiTag: {
    backgroundColor: Color.PRIMARY,
    width: wp('30%'),
    height: hp('4%'),
    justifyContent: 'center',
    borderTopRightRadius: wp('4%'),
    paddingHorizontal: wp('3%'),
  },
  rentangNilaiTagText: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: 12,
    color: Color.WHITE,
    textAlign: 'left',
  },
  rentangNilaiContainer: {
    backgroundColor: Color.WHITE,
    width: wp('90%'),
    height: hp('25%'),
    borderColor: Color.PRIMARY,
    borderWidth: wp('0.3%'),
    borderTopRightRadius: wp('3%'),
    borderBottomLeftRadius: wp('3%'),
    borderBottomRightRadius: wp('3%'),
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('5%'),
    marginBottom: hp('3.5%'),
  },
  list: {},
  listItem: {
    flexDirection: 'row',
    paddingVertical: hp('0.5%'),
  },
  listItemText: {
    fontFamily: FontFamily.poppinsRegular,
    fontSize: 12,
    color: Color.PRIMARY,
  },
});

export default KesuburanScreen;
