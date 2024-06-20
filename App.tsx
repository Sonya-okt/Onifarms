/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ApplicationNavigator from './src/routers/ApplicationNavigator';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ApplicationNavigator />
    </GestureHandlerRootView>
  );
};

export default App;
