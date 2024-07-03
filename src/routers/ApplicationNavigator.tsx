import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainAppNavigator from './MainAppNavigator';
import AuthNavigator from './AuthNavigator';
import Splash from '../pages/welcomeScreen/Splash';
import RNSecureStorage from 'rn-secure-storage';

const ApplicationNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userUID = await RNSecureStorage.getItem('userUID');
        setIsLoggedIn(!!userUID);
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const onLogin = () => {
    setIsLoggedIn(true);
  };

  const onLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <NavigationContainer>
      {isLoading ? (
        <Splash />
      ) : isLoggedIn ? (
        <MainAppNavigator onLogout={onLogout} />
      ) : (
        <AuthNavigator onLogin={onLogin} />
      )}
    </NavigationContainer>
  );
};

export default ApplicationNavigator;
