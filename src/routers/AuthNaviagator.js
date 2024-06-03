import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Splash from '../pages/welcomeScreen/Splash';
import Login from '../pages/authScreen/Login';
import Register from '../pages/authScreen/Register';
import Monitoring from '../pages/appScreen/monitoringScreen/MonitoringScreen';

const Stack = createStackNavigator();

const AuthStackNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="FirstNavigation"
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
