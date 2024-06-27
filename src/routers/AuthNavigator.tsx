import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Splash from '../pages/welcomeScreen/Splash';
import Login from '../pages/authScreen/Login';
import Register from '../pages/authScreen/Register';
import Monitoring from '../pages/appScreen/monitoringScreen/MonitoringScreen';

type StackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Monitoring: undefined;
};

const Stack = createStackNavigator<StackParamList>();

const AuthStackNav: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Monitoring" component={Monitoring} />
    </Stack.Navigator>
  );
};

export default AuthStackNav;
