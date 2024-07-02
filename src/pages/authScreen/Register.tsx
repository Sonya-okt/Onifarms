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
import auth from '@react-native-firebase/auth';
import {
  statusCodes,
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';

type RootStackParamList = {
  Login: undefined;
};

const Register: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState<boolean>(false);
  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const validateInputs = (): boolean => {
    let isValid = true;
    if (!name) {
      setNameError('Nama harus diisi');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!email || !isValidEmail(email)) {
      setEmailError('Mohon isi dengan email yang valid');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password || !isValidPassword(password)) {
      setPasswordError(
        'Password harus terdiri dari 1 huruf besar, 1 angka, dan 1 karakter khusus',
      );
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Password tidak sesuai');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  };

  const initializeUserData = async (
    uid: string,
    email: string,
    name: string,
  ) => {
    const initialRealtimeData = {
      Average: {
        suhu: 0,
        kelembapan: 0,
        ph: 0,
        nitrogen: 0,
        phosphor: 0,
        kalium: 0,
      },
      DataRecord: {
        tanggal: {
          waktu: {
            suhu: 0,
            kelembapan: 0,
            ph: 0,
            nitrogen: 0,
            phosphor: 0,
            kalium: 0,
          },
        },
      },
      Data: {
        bendengan1: {
          longitude: 0,
          latitude: 0,
          suhu: 0,
          kelembapan: 0,
          ph: 0,
          nitrogen: 0,
          phosphor: 0,
          kalium: 0,
        },
      },
    };

    const initialFirestoreData = {
      plantHarvestDay: {},
      userData: {
        nama: name,
        email: email,
      },
      watering: {
        watering1: {
          status: {
            status: '',
            time: '',
            day: '',
          },
        },
      },
    };

    try {
      await database().ref(`/${uid}`).set(initialRealtimeData);
      await firestore()
        .collection(uid)
        .doc('userData')
        .set(initialFirestoreData.userData);
      await firestore()
        .collection(uid)
        .doc('plantHarvestDay')
        .set(initialFirestoreData.plantHarvestDay);
      await firestore()
        .collection(uid)
        .doc('watering')
        .collection('watering1')
        .doc('status')
        .set(initialFirestoreData.watering.watering1.status);
    } catch (error) {
      console.error('Error initializing user data: ', error);
    }
  };

  GoogleSignin.configure({
    webClientId:
      '356008102834-kqjn35u18f65r4jnt8vut9e3gc02o38u.apps.googleusercontent.com',
  });

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
      Alert.alert(message);
    }
  };

  const handleRegister = async (): Promise<void> => {
    if (!validateInputs()) {
      return;
    }
    setLoading(true);
    try {
      const signInMethods = await auth().fetchSignInMethodsForEmail(email);
      console.log('Sign-in methods: ', signInMethods);

      if (signInMethods.includes(auth.EmailAuthProvider.PROVIDER_ID)) {
        showToast('Akun sudah terdaftar, silahkan lakukan login');
        setLoading(false);
        return;
      }

      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const {uid} = userCredential.user;

      if (uid && email && name) {
        await initializeUserData(uid, email, name);
      } else {
        console.error('Error: One of the required parameters is null.');
      }

      showToast('Registrasi sukses');
      navigation.navigate('Login');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        showToast('Email sudah dipakai');
      } else {
        showToast('Registrasi gagal');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async (): Promise<void> => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.revokeAccess();
      const userInfo = await GoogleSignin.signIn();
      const {idToken, user} = userInfo;

      if (!idToken) {
        showToast('Gagal mendapatkan token autentikasi Google.');
        setLoading(false);
        return;
      }

      console.log('Email pengguna dari Google: ', user.email);
      const signInMethods = await auth().fetchSignInMethodsForEmail(user.email);
      console.log('Sign-in methods: ', signInMethods);

      // Periksa apakah email sudah terdaftar dengan metode autentikasi lain
      if (signInMethods.length > 0) {
        if (signInMethods.includes(auth.GoogleAuthProvider.PROVIDER_ID)) {
          showToast(
            'Akun sudah terdaftar dengan Google, silahkan lakukan login',
          );
        } else {
          showToast(
            'Akun sudah terdaftar dengan metode lain, silahkan lakukan login',
          );
        }
        setLoading(false);
        return;
      }

      const credential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(credential);

      const {uid} = userCredential.user;
      const email = user.email || '';
      const name = user.name || '';

      if (uid && email && name) {
        await initializeUserData(uid, email, name);
      } else {
        console.error('Error: One of the required parameters is null.');
      }

      showToast('Registrasi sukses');
      navigation.navigate('Login');
    } catch (error: any) {
      console.error(error);
      if (error.code) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            showToast('Sign in dibatalkan');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            showToast(
              'Google Play Services tidak tersedia. Mohon update atau berikan akses.',
            );
            break;
          case statusCodes.SIGN_IN_REQUIRED:
            showToast('Sign in diperlukan untuk melanjutkan');
            break;
          default:
            showToast('Terjadi error dengan Google Sign-In.');
        }
      } else {
        showToast(`Terjadi kesalahan: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      style={[styles.registerContainer]}
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
        <DescLogo style={{marginTop: hp('12%')}} />

        <View style={{marginTop: hp('32%')}}>
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
                onChangeText={text => {
                  setName(text);
                  if (!text) {
                    setNameError('Nama harus diisi');
                  } else {
                    setNameError('');
                  }
                }}
                autoCapitalize="none"></TextInput>
            </View>
          </View>
          {nameError ? (
            <Text style={styles.textErrorStyle}>{nameError}</Text>
          ) : null}

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
                onChangeText={text => {
                  setEmail(text);
                  if (!isValidEmail(text)) {
                    setEmailError('Mohon isi dengan email yang valid');
                  } else {
                    setEmailError('');
                  }
                }}
                autoCapitalize="none"></TextInput>
            </View>
          </View>
          {emailError ? (
            <Text style={styles.textErrorStyle}>{emailError}</Text>
          ) : null}

          {/* password */}
          <View style={{...styles.authWrapper, marginTop: 34}}>
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
                if (!isValidPassword(text)) {
                  setPasswordError(
                    'Password harus terdiri dari 1 huruf besar, 1 angka, dan 1 karakter khusus',
                  );
                } else {
                  setPasswordError('');
                }
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
                    ? require('../../components/images/authImage/visibility_on.png')
                    : require('../../components/images/authImage/visibility_off.png')
                }
                style={styles.visibilityIcon}
              />
            </TouchableOpacity>
          </View>
          {passwordError ? (
            <Text style={styles.textErrorStyle}>{passwordError}</Text>
          ) : null}

          {/* confirm password */}
          <View style={{...styles.authWrapper, marginTop: 34}}>
            <View style={styles.markWrapper}>
              <Text style={styles.authTextWrapper}>Konfirmasi Password</Text>
            </View>
            <TextInput
              value={confirmPassword}
              style={[styles.authTextInput, {marginRight: wp('12%')}]}
              placeholder="Konfirmasi password"
              placeholderTextColor={Color.PLACEHOLDER_TXT}
              onChangeText={text => {
                setConfirmPassword(text);
                if (text !== password) {
                  setConfirmPasswordError('Password tidak sesuai');
                } else {
                  setConfirmPasswordError('');
                }
              }}
              secureTextEntry={!confirmPasswordVisible}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.visibilityToggle}
              onPress={() =>
                setConfirmPasswordVisible(!confirmPasswordVisible)
              }>
              <Image
                source={
                  confirmPasswordVisible
                    ? require('../../components/images/authImage/visibility_on.png')
                    : require('../../components/images/authImage/visibility_off.png')
                }
                style={styles.visibilityIcon}
              />
            </TouchableOpacity>
          </View>
          {confirmPasswordError ? (
            <Text style={styles.textErrorStyle}>{confirmPasswordError}</Text>
          ) : null}
        </View>

        {/* Register Button */}
        <View style={styles.buttonRegister}>
          <TouchableOpacity onPress={handleRegister}>
            {loading ? (
              <ActivityIndicator size="small" color={Color.colorGray_100} />
            ) : (
              <Text style={styles.buttonLoginTxt}>Register</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Reg dengan google */}
        <TouchableOpacity
          style={[styles.buttonLoginGoogle]}
          onPress={handleGoogleSignUp}>
          <Image
            style={[styles.googleIcon]}
            resizeMode="cover"
            source={require('../../components/images/authImage/logoGoogle.png')}
          />
          <Text style={[styles.regDenganGoogle]}>Register dengan Google</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  registerContainer: {
    width: wp('100%'),
    height: hp('100%'),
  },

  //Email pasw
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
  //Register Button
  buttonRegister: {
    marginTop: hp('7%'),
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
  },

  // Log with google
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
  regDenganGoogle: {
    fontSize: wp('3%'),
    textAlign: 'center',
    justifyContent: 'center',
    fontFamily: FontFamily.poppinsRegular,
    fontWeight: 'bold',
    color: Color.PRIMARY,
  },
});

export default Register;
