import * as React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {FontFamily, Color} from '../../constants/GlobalStyles';
import BackIcon from '../svgFunComponent/bottomNavSvg/BackIcon';

const TitlePage: React.FC<{Title: string}> = ({Title}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.titleContainer}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.goBack()}>
        <BackIcon style={styles.backIconImg} />
      </TouchableOpacity>
      <Text style={styles.titleText}>{Title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    height: hp('6.7%'),
    width: wp('100%'),
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: '#fff',
    borderStyle: 'solid',
    borderColor: '#155743',
    borderRightWidth: 1.2,
    borderBottomWidth: 1.2,
    borderLeftWidth: 1.2,
    position: 'absolute',
    zIndex: 100,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: FontFamily.poppinsBold,
    color: Color.PRIMARY,
    textAlign: 'center',
  },
  backIcon: {
    position: 'absolute',
    left: 20,
    height: '100%',
    justifyContent: 'center',
  },
  backIconImg: {
    height: 20,
    width: 20,
  },
});

export default TitlePage;
