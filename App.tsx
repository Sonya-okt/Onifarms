/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import MainAppNavigator from './src/routers/MainAppNavigator';
import BottomNavigator from './src/routers/BottomNavigator';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <MainAppNavigator />
    </GestureHandlerRootView>
  );
};

export default App;
