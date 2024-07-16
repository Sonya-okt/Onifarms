import React from 'react';
import {View, Image, StyleSheet, Text, ViewStyle} from 'react-native';
import {FontFamily, Color} from '../../constants/GlobalStyles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface DescLogoProps {
  style?: ViewStyle;
}

const DescLogo: React.FC<DescLogoProps> = ({style}) => {
  return (
    <View style={[styles.titlelogoonifarm, style]}>
      <View style={styles.logoTulisanOnifarm}>
        <Image
          style={styles.logoImage}
          resizeMode="cover"
          source={require('../../components/images/authImage/logoOnifarm.png')}
        />
        <Text style={styles.nifarm}>nifarm</Text>
      </View>
      <Text style={styles.sistemMonitoringTanah}>
        Sistem monitoring tanah bawang merah IoT
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  titlelogoonifarm: {
    width: wp('70%'),
    alignSelf: 'center',
    position: 'absolute',
  },
  logoTulisanOnifarm: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: wp('15%'),
    height: hp('10%'),
  },
  nifarm: {
    fontSize: wp('10%'),
    fontFamily: 'Poppins-Medium',
    color: '#207f6e',
  },
  sistemMonitoringTanah: {
    fontSize: wp('2.8%'),
    textTransform: 'capitalize',
    marginTop: 1,
    textAlign: 'center',
    fontFamily: FontFamily.poppinsRegular,
    color: Color.PRIMARY,
  },
});

export default DescLogo;
