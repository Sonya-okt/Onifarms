/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
 
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Dimensions,
  Image,
  Text,
} from 'react-native';
import TitlePage from '../../../components/recycle/TitlePage';
import BottomPage from '../../../components/recycle/BottomPage';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {Color, FontFamily} from '../../../constants/GlobalStyles';
import MonitoringCircleSvg from '../../../components/svgFunComponent/MonitoringCircleSvg';
import MonitoringMarkerLoc from '../../../components/svgFunComponent/MonitoringMarkerLoc';
import BottomSheets from './BottomSheets';

const {width, height} = Dimensions.get('window');

const Monitoring: React.FC = () => {

  return (
    <View style={styles.container}>
      <View style={styles.viewContainer}> 
          <BottomSheets/>
        <View style={styles.monitoringContainer}>
          <ImageBackground
            source={require('../../../components/images/monitoringImage/monitoringFieldImage.png')}
            resizeMode="cover"
            style={styles.sawahField}>
            <View style={styles.topLocationMasaTanam}>
              <View style={styles.topLocation}>
                <MonitoringMarkerLoc />
                <Text style={styles.topText}>Tembalang, Semarang</Text>
              </View>
              <Image
                source={require('../../../components/images/monitoringImage/monitoringDay.png')}
                resizeMode="contain"
                style={styles.dayNightImage}
              />
              <View
                style={{
                  height: '65%',
                  width: '40%',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: FontFamily.poppinsBold,
                    width: '100%',
                    color: 'black',
                    textAlign: 'right',
                    fontSize: hp('1.45%'),
                  }}>
                  Usia Tanam :
                </Text>
                <View
                  style={{
                    height: '60%',
                    width: '100%',
                    flexDirection: 'row',
                    // borderColor: 'black',
                    // borderWidth: 1,
                  }}>
                  <Text
                    style={{
                      fontFamily: FontFamily.poppinsBold,
                      right: '18%',
                      bottom: '-16%',
                      color: 'black',

                      textAlign: 'right',
                      fontSize: hp('2.5%'),
                      position: 'absolute',
                      // borderColor: 'orange',
                      // borderWidth: 1,
                    }}>
                    314
                  </Text>
                  <Text
                    style={{
                      fontFamily: FontFamily.poppinsBold,
                      width: '100%',
                      height: '60%',
                      bottom: 0,
                      color: 'black',

                      textAlign: 'right',
                      fontSize: hp('1.45%'),
                      position: 'absolute',
                      // borderColor: 'blue',
                      // borderWidth: 1,
                    }}>
                    hari
                  </Text>
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
                      <MonitoringCircleSvg style={styles.absolutePosition} />
                      <Text style={styles.monitoringNumber}>35</Text>
                      <Text style={styles.monitoringUnit}>°C</Text>
                    </View>
                  </View>
                  <View style={styles.miniMonitoringContainer}>
                    <Text style={styles.monitoringText}>Kelembapan</Text>
                    <View style={styles.svgWrapper}>
                      <MonitoringCircleSvg style={styles.absolutePosition} />
                      <Text style={styles.monitoringNumber}>80</Text>
                      <Text style={styles.monitoringUnit}>%</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.dividerMonitoringContainer}>
                  <View style={styles.miniMonitoringContainer}>
                    <Text style={styles.monitoringText}>pH</Text>
                    <View style={styles.svgWrapper}>
                      <MonitoringCircleSvg style={styles.absolutePosition} />
                      <Text style={styles.monitoringNumber}>6.5</Text>
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
                            style={styles.absolutePosition}
                          />
                          <Text style={styles.numberNPKText}>225</Text>
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
                            style={styles.absolutePosition}
                          />
                          <Text style={styles.numberNPKText}>225</Text>
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
                            style={styles.absolutePosition}
                          />
                          <Text style={styles.numberNPKText}>2000</Text>
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
        
      
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  absolutePosition: {
    position: 'absolute',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewContainer: {
    marginTop: hp('-2%'),
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
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
    // borderColor: 'black',
    // borderWidth: 1,
  },
  monitoringNumContainer: {
    top: hp('2.2%'),
    width: wp('87 %'),
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
    // borderColor: 'white',
    // borderWidth: 1,
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
    // borderColor: 'orange',
    // borderWidth: 1,
  },
  svgWrapper: {
    top: '17%',
    left: '0%',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: '60%',
    // borderColor: 'orange',
    // borderWidth: 1,
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
    top: '-2%',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: hp('7%'),
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
    // borderColor: 'orange',
    // borderWidth: 1,
  },
  tripleNPKNitrogen: {
    width: '40%',
    height: '50%',
    alignSelf: 'center',
    // borderColor: 'white',
    // borderWidth: 1,
  },
  NPKText: {
    fontFamily: FontFamily.poppinsMedium,
    color: 'white',
    textAlign: 'center',
    paddingBottom: '5%',
    // borderColor: 'black',
    // borderWidth: 1,
  },
  numberNPKCircle: {
    width: '100%',
    height: '60%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor: 'orange',
    // borderWidth: 1,
  },
  numberNPKText: {
    width: '95%',
    textAlign: 'center',
    fontSize: hp('2%'),
    fontFamily: FontFamily.poppinsBold,
    fontWeight: 'bold',
    color: 'black',
  },
  tripleNPKKaliumPhosphor: {
    bottom: '-4%',
    width: '40%',
    height: '50%',
    // borderColor: 'white',
    // borderWidth: 1,
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
    // borderColor: 'black',
    // borderWidth: 1,
  },
  topText: {
    width: '90%',
    fontFamily: FontFamily.poppinsBold,
    color: 'black',
    textAlign: 'left',
    marginLeft: '1.5%',
    fontSize: hp('1.45%'),
  },
  // BottomSheet
  containerz: {
    flex: 1,
  },
  sheetContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 10,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default Monitoring;
