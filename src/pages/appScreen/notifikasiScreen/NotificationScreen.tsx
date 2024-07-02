/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {Color, FontFamily} from '../../../constants/GlobalStyles';
import messaging from '@react-native-firebase/messaging';

interface Notification {
  id: string;
  title: string;
  subtitle: string;
  image: any; // Adjust this type based on the actual image type
  time: string;
  date: string;
}

const NotificationScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Saatnya menyiram tanamanmu!',
      subtitle: 'Pastikan untuk memberi air pada waktu yang telah ditentukan.',
      image: require('../../../components/images/notifikasiImage/watering.png'),
      time: '11.00',
      date: '29/10/24',
    },
    {
      id: '2',
      title: 'Peringatan : Kelembapan terlalu tinggi',
      subtitle: 'Kurangi kelembapan untuk tanaman yang sehat.',
      image: require('../../../components/images/notifikasiImage/npk.png'),
      time: '14.00',
      date: '28/10/24',
    },
    // Add more notifications as needed
  ]);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  async function getToken() {
    const fcmToken = await messaging().getToken();
    console.log('fcmToken: ', fcmToken);
  }

  useEffect(() => {
    async function requestPermissions() {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the notifications');
      } else {
        console.log('Notification permission denied');
      }
    }

    requestPermissions();
    requestUserPermission();
    getToken();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.notification) {
        Alert.alert(
          'A new FCM message arrived!',
          remoteMessage.notification?.body,
        );
      }
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({item}: {item: Notification}) => {
    return (
      <View style={styles.parentContainer}>
        <View style={styles.container}>
          <View style={styles.imagePosition}>
            <Image
              source={item.image}
              style={styles.imageSize}
              resizeMode="contain"
            />
          </View>
          <View style={styles.containerText}>
            <Text style={styles.textTitle}>{item.title}</Text>
            <Text style={styles.textSubtitle}>{item.subtitle}</Text>
          </View>
          <View style={styles.timestampNotif}>
            <Text style={styles.timeNotif}>{item.time}</Text>
            <Text style={styles.dateNotif}>{item.date}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      style={styles.linearGradient}
      colors={['#E0F8F0', '#FFFFFF', '#9BD5B5']}
      start={{x: 0, y: -0.4}}
      end={{x: 0.9, y: 1.5}}
      locations={[0.1, 0.5, 1]}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    marginTop: hp('-2%'),
    paddingTop: hp('2%'),
    alignItems: 'center',
  },
  parentContainer: {
    width: wp('98%'),
    alignItems: 'center',
  },
  container: {
    width: wp('89%'),
    height: hp('9%'),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.WHITE,
    borderColor: Color.PRIMARY,
    borderWidth: 0.7,
    borderRadius: wp('5%'),
    marginTop: hp('1%'),
  },
  text: {
    fontSize: 13,
    textAlign: 'center',
  },
  imagePosition: {
    height: '80%',
    width: '13%',
    marginLeft: wp('1.2%'),
  },
  imageSize: {
    height: '100%',
    width: '100%',
  },
  textTitle: {
    textAlign: 'left',
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: 'bold',
    fontSize: wp('3%'),
    color: 'black',
  },
  textSubtitle: {
    textAlign: 'left',
    fontFamily: FontFamily.poppinsMedium,
    fontSize: wp('2.6%'),
    color: 'black',
  },
  containerText: {
    height: '80%',
    width: '66%',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: wp('1.5%'),
    paddingRight: wp('2.3%'),
  },
  timestampNotif: {
    height: '80%',
    width: '14%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  timeNotif: {
    textAlign: 'right',
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: 'bold',
    fontSize: wp('2.8%'),
    color: 'black',
  },
  dateNotif: {
    textAlign: 'right',
    fontFamily: FontFamily.poppinsMedium,
    fontSize: wp('2.5%'),
    marginTop: wp('1%'),
    color: 'black',
  },
});
export default NotificationScreen;
