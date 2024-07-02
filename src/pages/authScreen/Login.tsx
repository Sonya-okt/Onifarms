import React, {useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {FontFamily, Color} from '../../constants/GlobalStyles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import DescLogo from '../../components/recycle/DescLogo';
import auth from '@react-native-firebase/auth';
import {
  statusCodes,
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const {width, height} = Dimensions.get('window');

type RootStackParamList = {
  Register: undefined;
};

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  GoogleSignin.configure({
    webClientId:
      '356008102834-kqjn35u18f65r4jnt8vut9e3gc02o38u.apps.googleusercontent.com',
    profileImageSize: 120,
  });

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateInputs = (): boolean => {
    let isValid = true;

    if (!email || !isValidEmail(email)) {
      setEmailError('Mohon isi dengan email yang valid');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (password.length < 6) {
      setPasswordError('Password minimal 6 karakter');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
      Alert.alert(message);
    }
  };

  const handleLogin = async (): Promise<void> => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const token = await userCredential.user.getIdToken();
      ToastAndroid.show('Login sukses', ToastAndroid.LONG);
      handleSuccessfulLogin(token);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        ToastAndroid.show(
          'Akun tidak terdaftar. Mohon lakukan registrasi terlebih dahulu.',
          ToastAndroid.LONG,
        );
      } else if (error.code === 'auth/invalid-credential') {
        ToastAndroid.show(
          'Email/password tidak valid atau kadaluarsa. Silakan coba lagi.',
          ToastAndroid.LONG,
        );
      } else if (error.code === 'auth/wrong-password') {
        ToastAndroid.show('Email atau password salah.', ToastAndroid.LONG);
      } else {
        console.error(error);
        ToastAndroid.show(error.message || 'Login gagal', ToastAndroid.LONG);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.revokeAccess(); // Revoke access to ensure the account picker is shown
      const userInfo = await GoogleSignin.signIn();
      const {idToken} = userInfo;

      if (idToken) {
        // Cek apakah email terdaftar di Firebase
        const credential = auth.GoogleAuthProvider.credential(idToken);
        const firebaseUser = await auth().signInWithCredential(credential);

        // Cek apakah user baru atau existing
        if (firebaseUser.additionalUserInfo?.isNewUser) {
          // Jika user baru, logout kembali dan tampilkan pesan
          await auth().signOut();
          showToast(
            'Akun tidak ada, mohon lakukan registrasi terlebih dahulu.',
          );
        } else {
          showToast('Login dengan Google sukses');
          const token = await firebaseUser.user.getIdToken();
          handleSuccessfulLogin(token); // Panggil handleSuccessfulLogin dengan token
          // Navigasi ke layar Home atau layar lainnya
        }
      } else {
        showToast(
          'Email tidak terdaftar. Mohon lakukan registrasi terlebih dahulu.',
        );
      }
    } catch (error: any) {
      console.error('Error during Google Sign-In:', error);
      if (error.code) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            showToast('Sign in dibatalkan');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            showToast(
              'Google Play Services tidak tersedia. Mohon update atau izinkan.',
            );
            break;
          case statusCodes.IN_PROGRESS:
            showToast('Sign in sedang dalam proses');
            break;
          case statusCodes.SIGN_IN_REQUIRED:
            showToast('Sign in diperlukan');
            break;
          default:
            showToast('Terjadi error pada Google Sign-In.');
        }
      } else {
        showToast(`Terjadi kesalahan: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessfulLogin = async (token: string) => {
    try {
      await RNSecureStorage.setItem('authToken', token, {
        accessible: ACCESSIBLE.WHEN_UNLOCKED,
      });
      // Navigate to the desired screen
    } catch (error) {
      console.error('Error storing token:', error);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      ToastAndroid.show(
        'Mohon isi email untuk reset password',
        ToastAndroid.LONG,
      );
      return;
    }

    if (!isValidEmail(email)) {
      ToastAndroid.show('Format email tidak valid', ToastAndroid.LONG);
      return;
    }

    try {
      await auth().sendPasswordResetEmail(email);
      ToastAndroid.show(
        'Email reset password telah dikirim',
        ToastAndroid.LONG,
      );
    } catch (error: any) {
      console.error(error);
      ToastAndroid.show(
        error.message || 'Gagal mengirim email reset password',
        ToastAndroid.LONG,
      );
    }
  };

  const validateEmail = (text: string) => {
    if (!isValidEmail(text)) {
      setEmailError('Format email tidak valid');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (text: string) => {
    if (text.length < 6) {
      setPasswordError('Password minimal 6 karakter');
    } else {
      setPasswordError('');
    }
  };

  return (
    <LinearGradient
      style={[styles.loginContainer]}
      locations={[0, 0.44, 1]}
      colors={['#e0f8f0', '#fefefe', '#9bd5b6']}
      useAngle={true}
      angle={168.99}>
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
        keyboardShouldPersistTaps="handled">
        <DescLogo style={{marginTop: hp('17%')}} />

        {/* Authentikasi */}
        <View style={{marginTop: hp('37%')}}>
          <View style={styles.authWrapper}>
            <View style={styles.markWrapper}>
              <Text style={styles.authTextWrapper}>Email</Text>
            </View>
            <TextInput
              value={email}
              style={styles.authTextInput}
              placeholder="Masukkan email"
              placeholderTextColor={Color.PLACEHOLDER_TXT}
              autoCapitalize="none"
              onChangeText={text => {
                setEmail(text);
                validateEmail(text);
              }}
            />
          </View>
          {emailError ? (
            <Text style={styles.textErrorStyle}>{emailError}</Text>
          ) : null}

          <View style={{...styles.authWrapper, marginTop: hp('5%')}}>
            <View style={styles.markWrapper}>
              <Text style={styles.authTextWrapper}>Password</Text>
            </View>
            <TextInput
              value={password}
              style={[styles.authTextInput, {marginRight: wp('12%')}]}
              placeholder="Masukkan password"
              placeholderTextColor={Color.PLACEHOLDER_TXT}
              onChangeText={text => {
                setPassword(text);
                validatePassword(text);
              }}
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
          {passwordError ? (
            <Text style={styles.textErrorStyle}>{passwordError}</Text>
          ) : null}
        </View>

        <View style={[styles.forgotPassword]}>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={[styles.forgotPasswordText]}>
              Lupa Email/Password?
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonLogin}>
          <TouchableOpacity onPress={handleLogin}>
            {loading ? (
              <ActivityIndicator size="small" color={Color.colorGray_100} />
            ) : (
              <Text style={styles.buttonLoginTxt}>Login</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.buttonLoginGoogle]}
          onPress={handleGoogleLogin}>
          <Image
            style={styles.googleIcon}
            resizeMode="cover"
            source={require('../../components/images/authImage/logoGoogle.png')}
          />
          <Text style={styles.loginDenganGoogle}>Login dengan Google</Text>
        </TouchableOpacity>

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
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: Color.GREYPROFILE,
  },
  authWrapper: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: wp('80%'),
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: Color.PRIMARY,
    borderRadius: wp('3%'),
  },
  markWrapper: {
    top: hp('-2.5%'),
    flexDirection: 'row',
    paddingHorizontal: 10,
    position: 'absolute',
  },
  authTextWrapper: {
    fontSize: wp('2.6%'),
    fontFamily: FontFamily.poppinsRegular,
    color: '#155743',
    textAlign: 'center',
  },
  authTextInput: {
    marginLeft: wp('2.5%'),
  },
  textErrorStyle: {
    fontSize: wp('2.6%'),
    color: 'red',
    marginLeft: wp('12%'),
    marginTop: hp('0.5%'),
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
  logintoregist: {
    alignSelf: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    marginBottom: hp('5%'),
  },
  logToRegText: {
    justifyContent: 'center',
    color: Color.PRIMARY,
    fontSize: wp('3%'),
  },
  logToRegDirect: {
    textDecorationLine: 'underline',
    fontWeight: '600',
    marginLeft: 2,
  },
  forgotPassword: {
    alignSelf: 'center',
  },
  forgotPasswordText: {
    marginTop: hp('1.5%'),
    width: wp('76%'),
    color: Color.PRIMARY,
    fontSize: 10,
    textDecorationLine: 'underline',
  },
  buttonLogin: {
    marginTop: hp('8%'),
    height: 37,
    width: 89,
    alignSelf: 'center',
    backgroundColor: Color.PRIMARY,
    borderRadius: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLoginTxt: {
    color: Color.WHITE,
    fontSize: wp('3.2%'),
    textAlign: 'center',
    fontFamily: FontFamily.poppinsRegular,
    fontWeight: 'bold',
  },
  buttonLoginGoogle: {
    marginTop: hp('4%'),
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: wp('2%'),
  },
  googleIcon: {
    width: wp('5%'),
    height: hp('3%'),
  },
  loginDenganGoogle: {
    fontSize: wp('3%'),
    textAlign: 'center',
    justifyContent: 'center',
    fontFamily: FontFamily.poppinsRegular,
    fontWeight: 'bold',
    color: Color.PRIMARY,
  },
});

export default Login;
