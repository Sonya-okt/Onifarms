/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MonitoringScreen from '../pages/appScreen/monitoringScreen/MonitoringScreen';
import NotificationScreen from '../pages/appScreen/notifikasiScreen/NotificationScreen';
import KesuburanScreen from '../pages/appScreen/kesuburanScreen/KesuburanScreen';
import PengaturanScreen from '../pages/appScreen/pengaturanScreen/PengaturanScreen';
import BottomSheets from '../pages/appScreen/monitoringScreen/BottomSheets';
import BottomNavigator from './BottomNavigator';

const MainAppNavigator = () => {
  return (
    <NavigationContainer>
      {/* <MonitoringScreen /> */}
      {/* <NotificationScreen /> */}
      {/* <KesuburanScreen /> */}
      {/* <PengaturanScreen /> */}
      {/* <BottomSheets /> */}
      <BottomNavigator />
    </NavigationContainer>
  );
};

export default MainAppNavigator;
