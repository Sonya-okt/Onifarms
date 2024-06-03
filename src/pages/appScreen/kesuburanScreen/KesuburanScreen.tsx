import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const KesuburanScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome to Kesuburan Page</Text>
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

export default KesuburanScreen;
