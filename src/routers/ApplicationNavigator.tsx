// src/navigation/ApplicationNavigator.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainAppNavigator from './MainAppNavigator';
import {MonitoringProvider} from '../components/api/contextApi/MonitoringKesuburanContext';

const ApplicationNavigator = () => {
  return (
    <MonitoringProvider>
      <NavigationContainer>
        <MainAppNavigator />
      </NavigationContainer>
    </MonitoringProvider>
  );
};

export default ApplicationNavigator;
