/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {FontFamily, Color} from '../../constants/GlobalStyles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import DescLogo from '../../components/recycle/DescLogo';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  statusCodes,
  isErrorWithCode,
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';

const {width, height} = Dimensions.get('window');

const Register = () => {
  const [name, setName] = useState(''); // State for storing name input
  const [phoneNumber, setPhoneNumber] = useState(''); // State for storing phone number input
  const [email, setEmail] = useState(''); // State for storing email input
  const [password, setPassword] = useState(''); // State for storing password input
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const validateInputs = () => {
    if (!name || !phoneNumber || !email || !password) {
      ToastAndroid.show('Mohon isi semua data', ToastAndroid.LONG);
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      ToastAndroid.show('Mohon isi dengan email yang valid', ToastAndroid.LONG);
      return false;
    }
    if (password.length < 6) {
      ToastAndroid.show('Password minimal 6 karakter', ToastAndroid.LONG);
      return false;
    }
    return true;
  };

  GoogleSignin.configure({
    webClientId:
      '356008102834-kqjn35u18f65r4jnt8vut9e3gc02o38u.apps.googleusercontent.com',
    profileImageSize: 120,
  });

  const handleRegister = async () => {
    if (!validateInputs()) {
      return;
    }
    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const userId = userCredential.user.uid;
      await firestore().collection('users').doc(userId).set({
        name: name,
        phoneNumber: phoneNumber,
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      ToastAndroid.show('Registrasi sukses', ToastAndroid.LONG);
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        ToastAndroid.show('Email sudah dipakai', ToastAndroid.LONG);
      } else {
        ToastAndroid.show('Registrasi gagal', ToastAndroid.LONG);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const token = userInfo.idToken;
      handleSuccessfulRegister(token);
    } catch (error) {
      console.error(error);
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.NO_SAVED_CREDENTIAL_FOUND:
            ToastAndroid.show(
              'Akun google tidak ditemukan. Mohon gunakan sign in normal',
              ToastAndroid.LONG,
            );
            break;
          case statusCodes.SIGN_IN_CANCELLED:
            ToastAndroid.show('Sign in dibatalkan', ToastAndroid.LONG);
            break;
          case statusCodes.ONE_TAP_START_FAILED:
            ToastAndroid.show(
              'Sign in gagal. Mohon coba lagi',
              ToastAndroid.LONG,
            );
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            ToastAndroid.show(
              'Google Play Services tidak tersedia. Mohon update atau berikan akses.',
              ToastAndroid.LONG,
            );
            break;
          default:
            ToastAndroid.show(
              'Terjadi error dengan Google Sign-In.',
              ToastAndroid.LONG,
            );
        }
      } else {
        ToastAndroid.show(
          `An error occurred: ${error.message}`,
          ToastAndroid.LONG,
        );
      }
    }
  };

  const handleSuccessfulRegister = async token => {
    try {
      await RNSecureStorage.setItem('authToken', token, {
        accessible: ACCESSIBLE.WHEN_UNLOCKED,
      });
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error storing token:', error);
    }
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior="position">
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <LinearGradient
          style={[styles.login, styles.iconLayout]}
          locations={[0, 0.44, 1]}
          colors={['#e0f8f0', '#fefefe', '#9bd5b6']}
          useAngle={true}
          angle={168.99}>
          {/* Judul */}
          <DescLogo style={{top: 105}} />

          {/* Authentikasi */}
          {/* nama */}
          <View>
            <View style={styles.authWrapper}>
              <View style={styles.markWrapper}>
                <Text style={styles.authTextWrapper}>Nama</Text>
              </View>
              <View>
                <TextInput
                  value={name}
                  style={styles.authTextInput}
                  placeholder="Masukkan nama"
                  placeholderTextColor={Color.PLACEHOLDER_TXT}
                  textErrorStyle={styles.textErrorStyle}
                  onChangeText={text => setName(text)}
                  autoCapitalize="none"></TextInput>
              </View>
            </View>

            {/* email */}
            <View style={{...styles.authWrapper, marginTop: 34}}>
              <View style={styles.markWrapper}>
                <Text style={styles.authTextWrapper}>Email</Text>
              </View>
              <View>
                <TextInput
                  value={email}
                  style={styles.authTextInput}
                  placeholder="Masukkan email"
                  placeholderTextColor={Color.PLACEHOLDER_TXT}
                  textErrorStyle={styles.textErrorStyle}
                  onChangeText={text => setEmail(text)}
                  autoCapitalize="none"></TextInput>
              </View>
            </View>

            {/* No. Telp */}
            <View style={{...styles.authWrapper, marginTop: 34}}>
              <View style={styles.markWrapper}>
                <Text style={styles.authTextWrapper}>No. Telepon</Text>
              </View>
              <View>
                <TextInput
                  value={phoneNumber}
                  style={styles.authTextInput}
                  placeholder="Masukkan nomor telepon"
                  placeholderTextColor={Color.PLACEHOLDER_TXT}
                  textErrorStyle={styles.textErrorStyle}
                  onChangeText={text => setPhoneNumber(text)}
                  autoCapitalize="none"></TextInput>
              </View>
            </View>

            {/* pasword */}
            <View style={{...styles.authWrapper, marginTop: 34}}>
              <View style={styles.markWrapper}>
                <Text style={styles.authTextWrapper}>Password</Text>
              </View>
              <TextInput
                value={password}
                style={styles.authTextInput}
                placeholder="Masukkan password"
                placeholderTextColor={Color.PLACEHOLDER_TXT}
                textErrorStyle={styles.textErrorStyle}
                onChangeText={text => setPassword(text)}
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.visibilityToggle}
                onPress={() => setPasswordVisible(!passwordVisible)}>
                <Image
                  source={
                    passwordVisible
                      ? require('../../components/images/authImage/visibility_off.png')
                      : require('../../components/images/authImage/visibility_on.png')
                  }
                  style={styles.visibilityIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Button */}
          <View style={styles.buttonRegister}>
            <TouchableOpacity
              onPress={() => {
                handleRegister;
              }}>
              {loading ? (
                <ActivityIndicator size="small" color={Color.colorGray_100} />
              ) : (
                <Text style={styles.buttonLoginTxt}>Register</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Reg dengan googel */}
          <TouchableOpacity
            style={[styles.buttonLoginGoogle]}
            onPress={() => {
              handleGoogleSignUp;
            }}>
            <Image
              style={[styles.googleIcon, styles.loginLayout]}
              resizeMode="cover"
              source={require('../../components/images/authImage/logoGoogle.png')}
            />
            <Text style={[styles.regDenganGoogle, styles.loginLayout]}>
              Register dengan Google
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  iconLayout: {
    maxWidth: '100%',
    overflow: 'hidden',
    maxHeight: '100%',
  },
  login: {
    width: width,
    height: height,
    backgroundColor: Color.modif4,
  },

  //Email pasw
  authWrapper: {
    top: 240,
    alignSelf: 'center',
    justifyContent: 'center',
    width: 320,
    height: 55,
    backgroundColor: '#ffff',
    borderWidth: 1,
    borderColor: Color.PRIMARY,
    borderRadius: 15,
    position: 'relative',
  },
  markWrapper: {
    top: -20,
    height: 15,
    flexDirection: 'row',
    paddingHorizontal: 10,
    position: 'absolute',
  },
  authTextWrapper: {
    fontSize: 10,
    lineHeight: 10,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#155743',
    textAlign: 'center',
  },
  authTextInput: {
    left: 11,
  },
  textErrorStyle: {
    fontSize: 10,
    color: 'red',
  },
  visibilityToggle: {
    right: 25,
    justifyContent: 'center',
    position: 'absolute',
  },
  visibilityIcon: {
    width: 18,
    height: 18,
  },
  //LogintoRegistText
  logintoregist: {
    marginLeft: -86,
    top: 430,
    width: 172,
    height: 15,
    alignSelf: 'center',
    position: 'absolute',
    flexDirection: 'row',
  },
  logToRegText: {
    justifyContent: 'center',
    display: 'flex',
    color: Color.PRIMARY,
    lineHeight: 10,
    fontSize: 10,
    left: 0,
    top: 0,
    height: 15,
  },
  logToRegDirect: {
    textDecorationLine: 'underline',
    fontWeight: '600',
    marginLeft: 2,
  },

  //Register Button
  buttonRegister: {
    position: 'absolute',
    top: 585,
    height: 37,
    width: 89,
    alignSelf: 'center',
    backgroundColor: Color.PRIMARY,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLoginTxt: {
    color: Color.WHITE,
    lineHeight: 12,
    fontSize: 12,
    textAlign: 'center',
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
  },

  // Log with google
  buttonLoginGoogle: {
    top: 650,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    gap: wp('2%'),
  },
  googleIcon: {
    width: 20,
    height: 21,
    borderRadius: 15,
    top: 0,
    left: 0,
  },
  regDenganGoogle: {
    lineHeight: 12,
    fontSize: 12,
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    color: Color.PRIMARY,
  },
});

export default Register;
