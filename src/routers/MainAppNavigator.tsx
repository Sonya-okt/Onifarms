/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {Color, FontFamily} from '../constants/GlobalStyles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import BottomNavigator from './BottomNavigator';
import MonitoringScreen from '../pages/appScreen/monitoringScreen/MonitoringScreen';
import MapScreen from '../pages/appScreen/monitoringScreen/MapScreen';
import PengaturanScreen from '../pages/appScreen/pengaturanScreen/PengaturanScreen';
import DataRecordScreen from '../pages/appScreen/pengaturanScreen/DataRecordScreen';
import JadwalPenyiramanScreen from '../pages/appScreen/pengaturanScreen/JadwalPenyiramanScreen';
import MasaTanamScreen from '../pages/appScreen/pengaturanScreen/MasaTanamScreen';
import {StyleSheet} from 'react-native';

const MainAppNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="BottomTab">
      <Stack.Group>
        <Stack.Screen
          name="BottomTab"
          component={BottomNavigator}
          options={{headerShown: false}}
        />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        <Stack.Screen
          name="MonitoringScreen"
          component={MonitoringScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={{
            headerTitle: 'Maps',
            headerTitleAlign: 'center',
            headerTitleStyle: styles.headerTitleStyle,
            headerStyle: styles.headerStyle,
            headerBackTitleVisible: false,
            headerTintColor: Color.PRIMARY,
          }}
        />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        <Stack.Screen name="PengaturanScreen" component={PengaturanScreen} />
        <Stack.Screen
          name="MasaTanam"
          component={MasaTanamScreen}
          options={{
            headerTitle: 'Masa Tanam',
            headerTitleAlign: 'center',
            headerTitleStyle: styles.headerTitleStyle,
            headerStyle: styles.headerStyle,
            headerBackTitleVisible: false,
            headerTintColor: Color.PRIMARY,
          }}
        />
        <Stack.Screen
          name="JadwalPenyiraman"
          component={JadwalPenyiramanScreen}
          options={{
            headerTitle: 'Jadwal Penyiraman',
            headerTitleAlign: 'center',
            headerTitleStyle: styles.headerTitleStyle,
            headerStyle: styles.headerStyle,
            headerBackTitleVisible: false,
            headerTintColor: Color.PRIMARY,
          }}
        />
        <Stack.Screen
          name="DataRecord"
          component={DataRecordScreen}
          options={{
            headerTitle: 'Data Record',
            headerTitleAlign: 'center',
            headerTitleStyle: styles.headerTitleStyle,
            headerStyle: styles.headerStyle,
            headerBackTitleVisible: false,
            headerTintColor: Color.PRIMARY,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
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
});

export default MainAppNavigator;
