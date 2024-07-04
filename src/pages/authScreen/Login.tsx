import React, {useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
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
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

import RNSecureStorage, {ACCESSIBLE} from 'rn-secure-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type RootStackParamList = {
  Register: undefined;
};

const Login: React.FC<{onLogin: () => void}> = ({onLogin}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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
    if ((Platform.OS === 'ios', Platform.OS === 'android')) {
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
      const userCredential: FirebaseAuthTypes.UserCredential =
        await auth().signInWithEmailAndPassword(email, password);

      showToast('Login sukses');
      await handleSuccessfulLogin(userCredential);
      await displayStoredData(); // Panggil fungsi untuk menampilkan data yang tersimpan
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        showToast(
          'Akun tidak terdaftar. Mohon lakukan registrasi terlebih dahulu.',
        );
      } else if (error.code === 'auth/invalid-credential') {
        showToast(
          'Email/password tidak valid atau kadaluarsa. Silakan coba lagi.',
        );
      } else if (error.code === 'auth/wrong-password') {
        showToast('Email atau password salah.');
      } else {
        console.error(error);
        showToast(error.message || 'Login gagal');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessfulLogin = async (
    userCredential: FirebaseAuthTypes.UserCredential,
  ) => {
    try {
      const token = await userCredential.user.getIdToken();
      const uid = userCredential.user.uid;

      // Log the userID and token
      // console.log('User ID:', uid);
      // console.log('Token:', token);

      await RNSecureStorage.setItem('token', token, {
        accessible: ACCESSIBLE.WHEN_UNLOCKED,
      });
      await RNSecureStorage.setItem('userUID', uid, {
        accessible: ACCESSIBLE.WHEN_UNLOCKED,
      });
      onLogin();
    } catch (error) {
      console.error('Error storing token:', error);
    }
  };

  const displayStoredData = async () => {
    try {
      const token = await RNSecureStorage.getItem('token');
      const userUID = await RNSecureStorage.getItem('userUID');
      // console.log('Stored Token:', token);
      console.log('Stored User UID:', userUID);
    } catch (error) {
      console.error('Error retrieving stored data:', error);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      showToast('Mohon isi email untuk reset password');
      return;
    }

    if (!isValidEmail(email)) {
      showToast('Format email tidak valid');
      return;
    }

    try {
      await auth().sendPasswordResetEmail(email);
      showToast('Email reset password telah dikirim');
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'Gagal mengirim email reset password');
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

        <TouchableOpacity onPress={handleLogin} style={styles.buttonLogin}>
          {loading ? (
            <ActivityIndicator size="small" color={Color.colorGray_100} />
          ) : (
            <Text style={styles.buttonLoginTxt}>Login</Text>
          )}
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
