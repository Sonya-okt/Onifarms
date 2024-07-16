import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Login from '../pages/authScreen/Login';
import Register from '../pages/authScreen/Register';

type StackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  MainAppNavigator: undefined;
};

const Stack = createStackNavigator<StackParamList>();

const AuthNavigator: React.FC<{onLogin: () => void}> = ({onLogin}) => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}>
      <Stack.Screen name="Login">
        {props => <Login {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
