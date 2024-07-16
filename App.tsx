import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ApplicationNavigator from './src/routers/ApplicationNavigator';
import Orientation from 'react-native-orientation-locker';
import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';

const App = () => {
  useEffect(() => {
    Orientation.lockToPortrait(); // Mengunci orientasi ke mode potret

    const subscribeToTopic = async () => {
      await messaging().subscribeToTopic('all');
      console.log('Subscribed to topic!');
    };

    subscribeToTopic();

    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    // Membersihkan subscription saat komponen unmount
    return () => {
      unsubscribeForeground();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ApplicationNavigator />
    </GestureHandlerRootView>
  );
};

export default App;
