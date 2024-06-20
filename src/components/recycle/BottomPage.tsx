import * as React from 'react';
import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {Color} from '../../constants/GlobalStyles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import MonitoringMenuIcon from '../svgFunComponent/bottomNavSvg/MonitoringMenuIcon';
import NotificationMenuIcon from '../svgFunComponent/bottomNavSvg/NotificationMenuIcon';
import KesuburanMenuIcon from '../svgFunComponent/bottomNavSvg/KesuburanMenuIcon';
import PengaturanMenuIcon from '../svgFunComponent/bottomNavSvg/PengaturanMenuIcon';

const BottomPage: React.FC = () => {
  return (
    <TouchableOpacity style={styles.monitoringNavbarContainer}>
      <MonitoringMenuIcon />
      <NotificationMenuIcon />
      <KesuburanMenuIcon />
      <PengaturanMenuIcon />
    </TouchableOpacity>
  );
};

type Styles = {
  monitoringNavbarContainer: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  monitoringNavbarContainer: {
    width: wp('100%'),
    height: hp('6.5%'),
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    borderTopColor: Color.PRIMARY,
    borderBottomColor: Color.PRIMARY,
    backgroundColor: Color.WHITE,
    borderTopWidth: 0.8,
    borderBottomWidth: 0.2,
    position: 'absolute',
    zIndex: 99,
  },
});

export default BottomPage;
