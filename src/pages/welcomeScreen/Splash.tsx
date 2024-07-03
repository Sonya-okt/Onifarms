import React, {useEffect} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {FontFamily, Color} from '../../constants/GlobalStyles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

// Define the type for the navigation prop

const Splash: React.FC = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.splash}
        locations={[0, 0.44, 1]}
        colors={['#e0f8f0', '#ffff', '#9bd5b6']}
        useAngle={true}
        angle={168.99}>
        <Image
          style={styles.logoOnifarmIcon}
          resizeMode="contain"
          source={require('../../components/images/authImage/logoOnifarm.png')}
        />
        <Text style={styles.byTimbawangUndip}>by TimBawang_Undip</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoOnifarmIcon: {
    width: wp('70%'),
    height: hp('40%'),
    aspectRatio: 1,
    marginBottom: hp('2%'),
  },
  byTimbawangUndip: {
    bottom: hp('4%'),
    fontSize: wp('3%'),
    fontFamily: FontFamily.poppinsRegular,
    color: Color.GREEN_BOTTOMNAV,
    position: 'absolute',
  },
});

export default Splash;
