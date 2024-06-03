import React, {useEffect} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {FontFamily, Color} from '../../constants/GlobalStyles';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

const Splash = () => {
  const navigation = useNavigation();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 3000); // 3 detik

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.splash}
        locations={[0, 0.44, 1]}
        colors={['#e0f8f0', '#ffff', '#9bd5b6']}
        useAngle={true}
        angle={168.99}>
        <View style={[styles.logoOnifarmIconPosition]}>
          <Image
            style={[styles.logoOnifarmIcon]}
            resizeMode="cover"
            source={require('../../components/images/authImage/logoOnifarm.png')}
          />
        </View>
        <Text style={[styles.byTimbawangUndip]}>by TimBawang_Undip</Text>
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
  logoOnifarmIconPosition: {
    marginTop: -35,
  },
  logoOnifarmIcon: {
    width: 259,
    height: 313,
  },
  byTimbawangUndip: {
    bottom: hp('4 %'),
    fontSize: 12,
    fontFamily: FontFamily.poppinsMedium,
    color: Color.GREEN_BOTTOMNAV,
    alignSelf: 'center',
    position: 'absolute',
  },
});

export default Splash;
