import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
  Alert,
  ToastAndroid,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {Color, FontFamily} from '../../../constants/GlobalStyles';
import PhotoProfile from '../../../components/svgFunComponent/pengaturanSvg/PhotoProfile';
import AddPhoto from '../../../components/svgFunComponent/pengaturanSvg/AddPhoto';
import ButtonNavigation from '../../../components/svgFunComponent/pengaturanSvg/ButtonNavigation';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';
import auth from '@react-native-firebase/auth';
import RNSecureStorage from 'rn-secure-storage';
import firestore from '@react-native-firebase/firestore';
import {EventRegister} from 'react-native-event-listeners';
import database from '@react-native-firebase/database';

// Define the type for the navigation parameters
type RootStackParamList = {
  MasaTanam: undefined;
  PengaturanScreen: undefined;
  DataRecord: undefined;
};

const PengaturanScreen: React.FC<{onLogout: () => void}> = ({onLogout}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [profileName, setProfileName] = useState<string>('-');
  const [profileEmail, setProfileEmail] = useState<string>('-');
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const uid = await RNSecureStorage.getItem('userUID');
        if (uid) {
          setUid(uid);
          const userDoc = await firestore()
            .collection(uid)
            .doc('userData')
            .get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setProfileName(userData?.nama || '-');
            setProfileEmail(userData?.email || '-');
          } else {
            console.error('No such document!');
          }
        } else {
          console.error('No UID found in secure storage');
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };

    const loadPhoto = async () => {
      const savedPhotoUri = await AsyncStorage.getItem('profilePhoto');
      if (savedPhotoUri) {
        setPhotoUri(savedPhotoUri);
      }
    };

    loadProfile();
    loadPhoto();
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const result = await request(PERMISSIONS.IOS.CAMERA);
      return result === RESULTS.GRANTED;
    }
  };

  const handleCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      launchCamera({mediaType: 'photo'}, async response => {
        if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri ?? null;
          if (uri) {
            setPhotoUri(uri);
            await AsyncStorage.setItem('profilePhoto', uri);
          }
        }
      });
    } else {
      Alert.alert('Camera permission denied');
    }
  };

  const handleGallery = () => {
    launchImageLibrary({mediaType: 'photo'}, async response => {
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri ?? null;
        if (uri) {
          setPhotoUri(uri);
          await AsyncStorage.setItem('profilePhoto', uri);
        }
      }
    });
  };

  const handleProfilePhotoPress = () => {
    actionSheetRef.current?.setModalVisible(true);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Logout dibatalkan'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const currentUser = auth().currentUser;
              if (currentUser) {
                await auth().signOut();
                console.log('Signed out from Firebase');
              } else {
                console.log('No user currently signed in');
              }

              await RNSecureStorage.removeItem('userUID');
              console.log('Removed userUID from secure storage');
              await RNSecureStorage.removeItem('token');
              console.log('Removed token from secure storage');
              if (Platform.OS === 'android') {
                ToastAndroid.show('Logout sukses', ToastAndroid.LONG);
              }

              // Hentikan referensi database
              if (uid) {
                const dataRef = database().ref(`${uid}/DataRecord`);
                dataRef.off();
              }

              EventRegister.emit('logoutEvent'); // Emit logout event
              onLogout();
              console.log('Called onLogout');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to log out');
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        style={styles.linearGradient}
        colors={['#E0F8F0', '#FFFFFF', '#9BD5B5']}
        start={{x: 0, y: -0.4}}
        end={{x: 0.9, y: 1.5}}
        locations={[0.1, 0.5, 1]}>
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.photoProfileCircle}
            onPress={handleProfilePhotoPress}>
            {photoUri ? (
              <Image source={{uri: photoUri}} style={styles.profileImage} />
            ) : (
              <>
                <AddPhoto style={styles.addPhoto} />
                <PhotoProfile />
              </>
            )}
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profileName}</Text>
            <Text style={styles.profileEmail}>{profileEmail}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <LinearGradient
            style={styles.ButtonLinearGradient}
            start={{x: 0, y: 1.2}}
            end={{x: -0.1, y: 0.2}}
            colors={['#6aac99', '#bfd5cf']}
            locations={[0.1, 1]}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => navigation.navigate('MasaTanam')}>
              <Text style={styles.buttonText}>Masa tanam</Text>
              <ButtonNavigation />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => navigation.navigate('DataRecord')}>
              <Text style={styles.buttonText}>Data Record</Text>
              <ButtonNavigation />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutbuttonStyle}
              onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </LinearGradient>
      <ActionSheet ref={actionSheetRef}>
        <View>
          <TouchableOpacity onPress={handleCamera}>
            <Text style={styles.actionSheetText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGallery}>
            <Text style={styles.actionSheetText}>Choose from Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => actionSheetRef.current?.setModalVisible(false)}>
            <Text style={styles.actionSheetText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: hp('-2%'),
    borderWidth: wp('0.1%'),
    borderColor: Color.PRIMARY,
  },
  linearGradient: {
    flex: 1,
    paddingTop: hp('2%'),
    borderWidth: wp('0.1%'),
    borderColor: Color.PRIMARY,
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('3%'),
  },
  photoProfileCircle: {
    width: wp('25%'),
    height: hp('12%'),
    borderRadius: wp('100%'),
    borderWidth: wp('0.3%'),
    borderColor: Color.PRIMARY,
    backgroundColor: Color.GREYPROFILE,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp('100%'),
  },
  addPhoto: {
    bottom: 0,
    right: '10%',
    position: 'absolute',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: hp('1.5%'),
    gap: hp('0.5%'),
  },
  profileName: {
    fontFamily: FontFamily.poppinsBold,
    fontSize: wp('3.2%'),
    color: Color.PRIMARY,
  },
  profileEmail: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: wp('2.9%'),
    color: Color.PRIMARY,
  },
  buttonContainer: {
    flex: 1,
    marginTop: hp('5%'),
  },
  ButtonLinearGradient: {
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    height: '100%',
    width: wp('100%'),
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('2.5%'),
  },
  buttonStyle: {
    backgroundColor: Color.WHITE,
    height: hp('5.5%'),
    marginVertical: hp('1%'),
    borderRadius: wp('4%'),
    paddingHorizontal: wp('3%'),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: wp('0.25%'),
    borderColor: Color.PRIMARY,
  },
  buttonText: {
    fontSize: wp('3.4%'),
    fontFamily: FontFamily.poppinsMedium,
    color: Color.PRIMARY,
  },
  logoutbuttonStyle: {
    position: 'absolute',
    bottom: '11%',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    height: hp('30%'),
  },
  logoutText: {
    textDecorationLine: 'underline',
    fontFamily: FontFamily.poppinsBold,
    fontWeight: 'bold',
    fontSize: wp('4.1%'),
    color: Color.PRIMARY,
  },
  actionSheetText: {
    padding: 20,
    fontSize: 18,
  },
});

export default PengaturanScreen;
