import React from 'react';
import {View, Image, StyleSheet, Text, ViewStyle} from 'react-native';
import {FontFamily, Color} from '../../constants/GlobalStyles';

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
    height: 85,
    width: 241,
    alignSelf: 'center',
    position: 'absolute',
  },
  logoTulisanOnifarm: {
    width: 200,
    height: 73,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  logoImage: {
    width: 61,
    height: 73,
  },
  nifarm: {
    fontSize: 40,
    fontFamily: 'Poppins-Medium',
    textAlign: 'left',
    color: '#207f6e',
    alignSelf: 'center',
  },
  sistemMonitoringTanah: {
    fontSize: 11,
    lineHeight: 11,
    textTransform: 'capitalize',
    marginTop: 1,
    textAlign: 'center',
    fontFamily: FontFamily.poppinsRegular,
    color: Color.PRIMARY,
  },
});

export default DescLogo;
