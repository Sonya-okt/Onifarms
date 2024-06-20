import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {Color, FontFamily} from '../../../constants/GlobalStyles';
import PhotoProfile from '../../../components/svgFunComponent/pengaturanSvg/PhotoProfile';
import AddPhoto from '../../../components/svgFunComponent/pengaturanSvg/AddPhoto';
import ButtonNavigation from '../../../components/svgFunComponent/pengaturanSvg/ButtonNavigation';

// Define the type for the navigation parameters
type RootStackParamList = {
  MasaTanam: undefined;
  PengaturanScreen: undefined;
  JadwalPenyiraman: undefined;
  DataRecord: undefined;
};

const PengaturanScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.linearGradient}
        colors={['#E0F8F0', '#FFFFFF', '#9BD5B5']}
        start={{x: 0, y: -0.4}}
        end={{x: 0.9, y: 1.5}}
        locations={[0.1, 0.5, 1]}>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.photoProfileCircle}
            onPress={() => {}}>
            <AddPhoto style={styles.addPhoto} />
            <PhotoProfile />
            <View />
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Juragan Bawang</Text>
            <Text style={styles.profileEmail}>
              juraganbawangdemak@gmail.com
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <LinearGradient
            style={styles.ButtonLinearGradient}
            start={{x: 0, y: 1.2}}
            end={{x: 0, y: 0.1}}
            colors={['#327e69', '#bfd5cf']}
            locations={[0.1, 1]}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => navigation.navigate('MasaTanam')}>
              <Text style={styles.buttonText}>Masa tanam</Text>
              <ButtonNavigation />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => navigation.navigate('JadwalPenyiraman')}>
              <Text style={styles.buttonText}>Jadwal Penyiraman</Text>
              <ButtonNavigation />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => navigation.navigate('DataRecord')}>
              <Text style={styles.buttonText}>Data Record</Text>
              <ButtonNavigation />
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutbuttonStyle}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: hp('-2%'),
    borderWidth: wp('0.1%'),
    borderColor: Color.PRIMARY,
  },
  linearGradient: {
    flex: 1,
    paddingTop: hp('2%'),
    borderWidth: wp('0.1%'),
    borderColor: Color.PRIMARY,
    alignItems: 'center',
  },
  ccontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('3%'),
    // borderWidth: wp('0.3%'),
    // borderColor: 'black',
  },
  photoProfileCircle: {
    width: wp('25%'),
    height: hp('12%'),
    borderRadius: wp('100%'),
    borderWidth: wp('0.3%'),
    borderColor: Color.PRIMARY,
    backgroundColor: Color.GREYPROFILE,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
  },
  addPhoto: {
    bottom: 0,
    right: '10%',
    position: 'absolute',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: hp('1.5%'),
    gap: hp('0.5%'),
  },
  profileName: {
    fontFamily: FontFamily.poppinsBold,
    fontSize: wp('3.2%'),
    color: Color.PRIMARY,
  },
  profileEmail: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: wp('2.9%'),
    color: Color.PRIMARY,
  },
  buttonContainer: {
    flex: 1,
    marginTop: hp('5%'),
  },
  ButtonLinearGradient: {
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    height: hp('100%'),
    width: wp('100%'),
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('2.5%'),
  },
  buttonStyle: {
    backgroundColor: Color.WHITE,
    height: hp('5.5%'),
    marginVertical: hp('0.8%'),
    borderRadius: wp('4%'),
    paddingHorizontal: wp('3%'),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: wp('0.25%'),
    borderColor: Color.PRIMARY,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: FontFamily.poppinsMedium,
    color: Color.PRIMARY,
  },
  logoutbuttonStyle: {
    alignSelf: 'center',
    justifyContent: 'flex-end',
    height: hp('30%'),
  },
  logoutText: {
    textDecorationLine: 'underline',
    fontFamily: FontFamily.poppinsSemiBold,
    fontWeight: 'bold',
    fontSize: wp('4%'),
    color: Color.PRIMARY,
  },
});
export default PengaturanScreen;
