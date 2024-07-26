import React, {useEffect, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ApplicationNavigator from './src/routers/ApplicationNavigator';
import Orientation from 'react-native-orientation-locker';
import NetInfo from '@react-native-community/netinfo';
import NetworkAlert from './src/components/netAlert/NetworkAlert';

const App = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    Orientation.lockToPortrait(); // Mengunci orientasi ke mode potret

    //Pantau status koneksi
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      //console.log('Koneksi:', state.isConnected); // Tambahkan logging status koneksi
      setIsConnected(state.isConnected ?? true);
    });

    // Membersihkan subscription saat komponen unmount
    return () => {
      unsubscribeNetInfo();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      {!isConnected && <NetworkAlert message="Koneksi terputus" />}
      <ApplicationNavigator />
    </GestureHandlerRootView>
  );
};

export default App;
