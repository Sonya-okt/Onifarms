/* eslint-disable @typescript-eslint/no-unused-vars */
import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import BottomNavigator from './BottomNavigator';
import MainAppNavigator from './MainAppNavigator';

const ApplicationNavigator = () => {
  return (
    <NavigationContainer>
      <MainAppNavigator />
    </NavigationContainer>
  );
};

export default ApplicationNavigator;
