// src/navigation/ApplicationNavigator.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainAppNavigator from './MainAppNavigator';
import AuthNavigator from './AuthNavigator';

const ApplicationNavigator = () => {
  return (
    <NavigationContainer>
      <AuthNavigator />
      {/* <MainAppNavigator /> */}
    </NavigationContainer>
  );
};

export default ApplicationNavigator;
