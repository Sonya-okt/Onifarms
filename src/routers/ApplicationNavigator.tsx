import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainAppNavigator from './MainAppNavigator';
import AuthNavigator from './AuthNavigator';
import Splash from '../pages/welcomeScreen/Splash';
import RNSecureStorage from 'rn-secure-storage';

const ApplicationNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userUID = await RNSecureStorage.getItem('userUID');
        setIsLoggedIn(!!userUID);
      } catch (error) {
        console.log('Belum ada UID tersimpan:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!showSplash) {
      checkLoginStatus();
    }
  }, [showSplash]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const onLogin = () => {
    setIsLoggedIn(true);
  };

  const onLogout = () => {
    setIsLoggedIn(false);
    setShowSplash(true);
  };

  return (
    <NavigationContainer>
      {isLoading ? (
        <Splash onComplete={handleSplashComplete} />
      ) : isLoggedIn ? (
        <MainAppNavigator onLogout={onLogout} />
      ) : (
        <AuthNavigator onLogin={onLogin} />
      )}
    </NavigationContainer>
  );
};

export default ApplicationNavigator;
