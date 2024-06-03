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
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {FontFamily, Color} from '../../constants/GlobalStyles';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import DescLogo from '../../components/recycle/DescLogo';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  statusCodes,
  isErrorWithCode,
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';

const {width, height} = Dimensions.get('window');

const Login = () => {
  const [identifier, setIdentifier] = useState(''); // State for email or phone number input
  const [password, setPassword] = useState(''); // State for password input
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();

  GoogleSignin.configure({
    webClientId:
      '356008102834-kqjn35u18f65r4jnt8vut9e3gc02o38u.apps.googleusercontent.com',
    profileImageSize: 120,
  });

  const handleLogin = async () => {
    if (!identifier || !password) {
      ToastAndroid.show('Mohon si semua data', ToastAndroid.LONG);
      return;
    }
    setLoading(true);
    try {
      let loginIdentifier = identifier;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(identifier)) {
        const userSnapshot = await firestore()
          .collection('users')
          .where('phoneNumber', '==', identifier)
          .get();
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          loginIdentifier = userData.email;
        } else {
          throw new Error('Nomor telepon tidak terdaftar');
        }
      }
      const userCredential = await auth().signInWithEmailAndPassword(
        loginIdentifier,
        password,
      );
      const token = await userCredential.user.getIdToken();
      ToastAndroid.show('Login sukses', ToastAndroid.LONG);
      handleSuccessfulLogin(token);
    } catch (error) {
      console.error(error);
      ToastAndroid.show(error.message || 'Login gagal', ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const credential = auth.GoogleAuthProvider.credential(userInfo.idToken);
      const userCredential = await auth().signInWithCredential(credential);
      const token = await userCredential.user.getIdToken();
      ToastAndroid.show('Login dengan Google sukses', ToastAndroid.LONG);
      handleSuccessfulLogin(token);
    } catch (error) {
      console.error(error);
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.NO_SAVED_CREDENTIAL_FOUND:
            ToastAndroid.show(
              'Akun google tidak ditemukan. Mohon gunakan email dan password.',
              ToastAndroid.LONG,
            );
            break;
          case statusCodes.SIGN_IN_CANCELLED:
            ToastAndroid.show('Sign in dibatalkan', ToastAndroid.LONG);
            break;
          case statusCodes.ONE_TAP_START_FAILED:
            ToastAndroid.show(
              'One tap sign-in failed. Please try again.',
              ToastAndroid.LONG,
            );
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            ToastAndroid.show(
              'Google Play Services tidak tersedia. Mohon update atau izinkan.',
              ToastAndroid.LONG,
            );
            break;
          default:
            ToastAndroid.show(
              'Terjasi eror pada Google Sign-In.',
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

  const handleSuccessfulLogin = async token => {
    try {
      // Store the authentication token securely
      await RNSecureStorage.setItem('authToken', token, {
        accessible: ACCESSIBLE.WHEN_UNLOCKED,
      })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
      // Navigate to the desired screen
      navigation.navigate('Monitoring');
    } catch (error) {
      // Handle error storing token
      console.error('Error storing token:', error);
    }
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior="position">
      <LinearGradient
        style={[styles.login, styles.iconLayout]}
        locations={[0, 0.44, 1]}
        colors={['#e0f8f0', '#fefefe', '#9bd5b6']}
        useAngle={true}
        angle={168.99}>
        {/* Judul */}
        <DescLogo style={{top: 130}} />

        {/* Authentikasi */}
        {/* email */}
        <View>
          <View style={styles.authWrapper}>
            <View style={styles.markWrapper}>
              <Text style={styles.authTextWrapper}>Email/No.Telepon</Text>
            </View>
            <View>
              <TextInput
                value={identifier}
                style={styles.authTextInput}
                placeholder="Masukkan email / nomor telepon"
                placeholderTextColor={Color.PLACEHOLDER_TXT}
                autoCapitalize="none"
                textErrorStyle={styles.textErrorStyle}
                onChangeText={text => setIdentifier(text)}
              />
            </View>
          </View>

          {/* password */}
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

        {/* To Register */}
        <View style={[styles.logintoregist]}>
          <Text style={[styles.logToRegText]}>Belum punya akun?</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Register');
            }}>
            <Text style={[styles.logToRegText, styles.logToRegDirect]}>
              Register disini
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <View style={styles.buttonLogin}>
          <TouchableOpacity
            onPress={() => {
              handleLogin;
            }}>
            {loading ? (
              <ActivityIndicator size="small" color={Color.colorGray_100} />
            ) : (
              <Text style={styles.buttonLoginTxt}>Login</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Login dengan googel */}
        <TouchableOpacity
          style={[styles.buttonLoginGoogle]}
          onPress={() => {
            handleGoogleLogin;
          }}>
          <Image
            style={[styles.googleIcon, styles.loginLayout]}
            resizeMode="cover"
            source={require('../../components/images/authImage/logoGoogle.png')}
          />
          <Text style={[styles.loginDenganGoogle, styles.loginLayout]}>
            Login dengan Google
          </Text>
        </TouchableOpacity>
      </LinearGradient>
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
    top: 275,
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
    fontWeight: '500',
    fontFamily: FontFamily.interSemiBold,
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
    bottom: 30,
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

  //Login Button
  buttonLogin: {
    position: 'absolute',
    top: 462,
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
    top: 526,
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
  loginDenganGoogle: {
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

export default Login;
