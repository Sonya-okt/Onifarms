import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import BottomNavigator from './BottomNavigator';
import PengaturanScreen from '../pages/appScreen/pengaturanScreen/PengaturanScreen';
import DataRecordScreen from '../pages/appScreen/pengaturanScreen/DataRecordScreen';
import JadwalPenyiramanScreen from '../pages/appScreen/pengaturanScreen/JadwalPenyiramanScreen';
import MasaTanamScreen from '../pages/appScreen/pengaturanScreen/MasaTanamScreen';
import {StyleSheet} from 'react-native';
import {Color, FontFamily} from '../constants/GlobalStyles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const Stack = createStackNavigator();

const MainAppNavigator: React.FC<{onLogout: () => void}> = ({onLogout}) => {
  return (
    <Stack.Navigator
      initialRouteName="BottomTab"
      screenOptions={{...TransitionPresets.ScaleFromCenterAndroid}}>
      <Stack.Group>
        <Stack.Screen name="BottomTab" options={{headerShown: false}}>
          {props => <BottomNavigator {...props} onLogout={onLogout} />}
        </Stack.Screen>
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        <Stack.Screen name="PengaturanScreen">
          {props => <PengaturanScreen {...props} onLogout={onLogout} />}
        </Stack.Screen>
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
