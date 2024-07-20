// src/components/netAlert/NetworkAlert.tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Color, FontFamily} from '../../constants/GlobalStyles';

interface NetworkAlertProps {
  message: string;
}

const NetworkAlert: React.FC<NetworkAlertProps> = ({message}) => {
  return (
    <View style={styles.alertContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.alertText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    position: 'absolute',
    // top: hp('10%'),
    // left: wp('10%'),
    // right: wp('10%'),
    height: hp('100%'),
    width: wp('100%'),

    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  textContainer: {
    alignItems: 'center',
    backgroundColor: Color.WHITE,
    width: wp('80%'),
    height: hp('10%'),
    justifyContent: 'center',
    borderRadius: wp('5%'),
    elevation: 5,
  },
  alertText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: wp('4%'),
  },
});

export default NetworkAlert;
