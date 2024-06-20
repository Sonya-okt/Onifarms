/* eslint-disable react/no-unstable-nested-components */
import * as React from 'react';
import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Color, FontFamily} from '../constants/GlobalStyles';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MonitoringScreen from '../pages/appScreen/monitoringScreen/MonitoringScreen';
import NotificationScreen from '../pages/appScreen/notifikasiScreen/NotificationScreen';
import KesuburanScreen from '../pages/appScreen/kesuburanScreen/KesuburanScreen';
import PengaturanScreen from '../pages/appScreen/pengaturanScreen/PengaturanScreen';
import MonitoringMenuIcon from '../components/svgFunComponent/bottomNavSvg/MonitoringMenuIcon';
import NotificationMenuIcon from '../components/svgFunComponent/bottomNavSvg/NotificationMenuIcon';
import KesuburanMenuIcon from '../components/svgFunComponent/bottomNavSvg/KesuburanMenuIcon';
import PengaturanMenuIcon from '../components/svgFunComponent/bottomNavSvg/PengaturanMenuIcon';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Monitoring"
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: styles.headerTitleStyle,
        headerStyle: styles.headerStyle,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarInactiveTintColor: Color.PRIMARY,
        tabBarActiveTintColor: Color.WHITE,
        tabBarActiveBackgroundColor: Color.PRIMARY,
        tabBarItemStyle: styles.tabBarItemStyle,
      }}>
      <Tab.Screen
        name="Monitoring"
        component={MonitoringScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MonitoringMenuIcon fill={color} stroke={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifikasi"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({color}) => (
            <NotificationMenuIcon fill={color} stroke={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Kesuburan"
        component={KesuburanScreen}
        options={{
          tabBarIcon: ({color}) => <KesuburanMenuIcon stroke={color} />,
        }}
      />
      <Tab.Screen
        name="Pengaturan"
        component={PengaturanScreen}
        options={{
          tabBarIcon: ({color}) => <PengaturanMenuIcon stroke={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    height: hp('6.6%'),
    borderBottomLeftRadius: wp('5%'),
    borderBottomRightRadius: wp('5%'),
    borderEndWidth: wp('0.3%'),
    borderStartWidth: wp('0.3%'),
    borderBottomWidth: wp('0.3%'),
    borderBottomColor: Color.PRIMARY,
    borderStartColor: Color.PRIMARY,
    borderEndColor: Color.PRIMARY,
  },
  headerTitleStyle: {
    fontFamily: FontFamily.poppinsBold,
    fontWeight: '700',
    fontSize: 17,
    color: Color.PRIMARY,
    textAlign: 'center',
  },
  tabBarStyle: {
    borderTopWidth: wp('0.1%'),
    borderBottomWidth: wp('0.05%'),
    borderTopColor: Color.PRIMARY,
    borderBottomColor: Color.PRIMARY,
    paddingHorizontal: wp('1%'),
  },
  tabBarItemStyle: {
    borderRadius: wp('3%'),
    marginHorizontal: wp('5%'),
    width: wp('15%'),
    height: hp('5%'),
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default BottomNavigator;
