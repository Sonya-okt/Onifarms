import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Splash from '../pages/welcomeScreen/Splash';
import Login from '../pages/authScreen/Login';
import Register from '../pages/authScreen/Register';
import BottomNavigator from './BottomNavigator';

type StackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  BottomNavigator: undefined;
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
      <Stack.Screen
        name="BottomNavigator"
        component={BottomNavigator}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AuthStackNav;
