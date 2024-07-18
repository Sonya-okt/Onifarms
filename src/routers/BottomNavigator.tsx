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
import LastUpdateScreen from '../pages/appScreen/lastUpdateScreen/LastUpdateScreen';
import KesuburanScreen from '../pages/appScreen/kesuburanScreen/KesuburanScreen';
import PengaturanScreen from '../pages/appScreen/pengaturanScreen/PengaturanScreen';
import MonitoringMenuIcon from '../components/svgFunComponent/bottomNavSvg/MonitoringMenuIcon';
import KesuburanMenuIcon from '../components/svgFunComponent/bottomNavSvg/KesuburanMenuIcon';
import PengaturanMenuIcon from '../components/svgFunComponent/bottomNavSvg/PengaturanMenuIcon';
import LastUpdateMenuIcon from '../components/svgFunComponent/bottomNavSvg/LastUpdateMenuIcon';

const Tab = createBottomTabNavigator();

const BottomNavigator: React.FC<{onLogout: () => void}> = ({onLogout}) => {
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
        name="Data Update"
        component={LastUpdateScreen}
        options={{
          tabBarIcon: ({color}) => (
            <LastUpdateMenuIcon fill={color} stroke={color} />
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
        options={{
          tabBarIcon: ({color}) => <PengaturanMenuIcon stroke={color} />,
        }}>
        {props => <PengaturanScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
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
