/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Svg, {Circle} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import {Table, Row, Rows} from 'react-native-table-component';
import {Color, FontFamily} from '../../../constants/GlobalStyles';
import HighIndicator from '../../../components/svgFunComponent/kesuburanScreenSvg/HighIndicator';
import LowIndicator from '../../../components/svgFunComponent/kesuburanScreenSvg/LowIndicator';
import NormalIndicator from '../../../components/svgFunComponent/kesuburanScreenSvg/NormalIndicator';

const KesuburanScreen = () => {
  const scrollViewRef = useRef<ScrollView | null>(null);

  const [conditions, setConditions] = useState<Conditions>({
    suhu: 'Normal',
    kelembapan: 'Normal',
    pH: 'Normal',
    nitrogen: 'Normal',
    phosphor: 'Normal',
    kalium: 'Normal',
  });

  const widthArr = [wp('25%'), wp('10%'), wp('30%')];

  const conditionRanges = {
    suhu: {Rendah: '<25 °C', Normal: '25 - 32 °C', Tinggi: '>32 °C'},
    kelembapan: {Rendah: '0 - 50 %', Normal: '50 - 70 %', Tinggi: '70 - 100 %'},
    pH: {Rendah: '0 - 5.6', Normal: '5.6 - 6.5', Tinggi: '6.5 - 14'},
    nitrogen: {
      Rendah: '0 - 155 ppm',
      Normal: '155 - 250 ppm',
      Tinggi: '>250 ppm',
    },
    phosphor: {
      Rendah: '0 - 6.1 ppm',
      Normal: '6.1 - 12.2 ppm',
      Tinggi: '>12.2 ppm',
    },
    kalium: {
      Rendah: '0 - 65.5 ppm',
      Normal: '65.5 - 155.5 ppm',
      Tinggi: '>155.5 ppm',
    },
  };
  type Conditions = {
    suhu: keyof (typeof conditionRanges)['suhu'];
    kelembapan: keyof (typeof conditionRanges)['kelembapan'];
    pH: keyof (typeof conditionRanges)['pH'];
    nitrogen: keyof (typeof conditionRanges)['nitrogen'];
    phosphor: keyof (typeof conditionRanges)['phosphor'];
    kalium: keyof (typeof conditionRanges)['kalium'];
  };

  const tableData = [
    ['Suhu', ':', conditionRanges.suhu[conditions.suhu]],
    ['Kelembapan', ':', conditionRanges.kelembapan[conditions.kelembapan]],
    ['pH', ':', conditionRanges.pH[conditions.pH]],
    ['Nitrogen', ':', conditionRanges.nitrogen[conditions.nitrogen]],
    ['Phosphor', ':', conditionRanges.phosphor[conditions.phosphor]],
    ['Kalium', ':', conditionRanges.kalium[conditions.kalium]],
  ];

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.scrollViewStyle}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}>
      <LinearGradient
        style={styles.linearGradient}
        colors={['#E0F8F0', '#FFFFFF', '#9BD5B5']}
        start={{x: 0, y: -0.4}}
        end={{x: 0.9, y: 1.5}}
        locations={[0.1, 0.5, 1]}>
        <View style={styles.percentageIndicatorContainer}>
          <View style={styles.percentageContainer}>
            <Text style={styles.percentageTextNum}>100</Text>
            <Text style={styles.percentageText}>%</Text>
          </View>
          <View style={styles.indicatorContainer}>
            <View style={styles.childIndicatorContainer}>
              <View style={styles.redIndicator} />
              <Text style={styles.redIndicatorText}>Ekstrim</Text>
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
              <View style={styles.redCircleIndicator}>
                <HighIndicator />
              </View>
            </View>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.textIndicator}>Kelembapan</Text>
              <View style={styles.orangeCircleIndicator}>
                <LowIndicator />
              </View>
            </View>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.textIndicator}>pH</Text>
              <View style={styles.greenCircleIndicator}>
                <NormalIndicator />
              </View>
            </View>
          </View>
          <View style={[styles.lineCenter]} />
          <View style={styles.childTableIndicator}>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.textIndicator}>Suhu</Text>
              <View style={styles.redCircleIndicator}>
                <HighIndicator />
              </View>
            </View>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.textIndicator}>Kelembapan</Text>
              <View style={styles.orangeCircleIndicator}>
                <LowIndicator />
              </View>
            </View>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.textIndicator}>pH</Text>
              <View style={styles.greenCircleIndicator}>
                <NormalIndicator />
              </View>
            </View>
          </View>
        </View>

        {/* baris selanjutnya buat tabel */}
        <View style={{alignSelf: 'center'}}>
          <View
            style={{
              backgroundColor: Color.PRIMARY,
              width: wp('30%'),
              height: hp('4%'),
              justifyContent: 'center',
              borderTopRightRadius: wp('4%'),
              paddingHorizontal: wp('3%'),
            }}>
            <Text
              style={{
                fontFamily: FontFamily.poppinsSemiBold,
                fontSize: 12,
                color: Color.WHITE,
                textAlign: 'left',
              }}>
              Rentang nilai
            </Text>
          </View>
          <View
            style={{
              backgroundColor: Color.WHITE,
              width: wp('90%'),
              height: hp('25%,'),
              borderColor: Color.PRIMARY,
              borderWidth: wp('0.3%'),
              borderTopRightRadius: wp('3%'),
              borderBottomLeftRadius: wp('3%'),
              borderBottomRightRadius: wp('3%'),
              paddingVertical: hp('2%'),
              paddingHorizontal: wp('5%'),
              marginBottom: hp('3.5%'),
            }}>
            <Table>
              <Rows
                data={tableData}
                widthArr={widthArr}
                style={styles.childRentangNilai}
                textStyle={{...styles.textChildRentangNilai}}
              />
            </Table>
          </View>
        </View>

        {/*
      <View
        style={{
          width: wp('90%'),
          height: hp('25%,'),
          borderWidth: wp('0.3%'),
          borderRadius: wp('3%'),
          paddingVertical: hp('2%'),
          paddingHorizontal: wp('5%'),
          alignSelf: 'center',
          justifyContent: 'center',
          marginBottom: hp('3.5%'),
        }}>
        <Text>Hi</Text>
        <Text>Hu</Text>
        <Text>Hu</Text>
        <Text>Hu</Text>
      </View>
      */}
      </LinearGradient>
    </ScrollView>
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
    // borderWidth: wp('0.1%'),
    // borderColor: 'Color.PRIMARY',
  },
  percentageIndicatorContainer: {
    alignItems: 'center',
    marginTop: hp('1.5 %'),
    width: wp('100%'),
    height: hp('30%'),
    marginBottom: hp('2%'),
    // borderWidth: wp('0.1%'),
    // borderColor: Color.PRIMARY,
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
    height: hp('27%,'),
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
    // borderWidth: wp('0.1%'),
    // borderColor: Color.PRIMARY,
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
  childRentangNilai: {marginBottom: hp('0.5%')},
  textChildRentangNilai: {
    fontFamily: FontFamily.poppinsRegular,
    fontSize: 12,
    color: Color.PRIMARY,
    // borderColor: Color.PRIMARY,
    // borderWidth: wp('0.1%'),
  },
});
export default KesuburanScreen;
