import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const PengaturanScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome to Pengaturan Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
  },
});

export default PengaturanScreen;
