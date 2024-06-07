/* eslint-disable react/no-unstable-nested-components */
import React, {useCallback, useMemo, useRef} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const BottomSheets = () => {
  const snapPoints = useMemo(() => ['22%', '98%'], []);

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        index={0}
        snapPoints={snapPoints}
        backgroundComponent={() => (
          <View style={StyleSheet.absoluteFill}>
            <LinearGradient
              style={styles.gradient}
              colors={['#e0f8f0', '#fefefe', '#9bd5b6']}
              start={{x: 0, y: -0.25}}
              end={{x: 0.9, y: 0.8}}
              locations={[0.1, 0.5, 1]}
            />
          </View>
        )}>
        <View style={styles.contentContainer}>
          <Text>Its Bottom Sheetss</Text>
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
    borderRadius: wp('5%'),
    borderTopColor: '#E6E6E6',
    borderTopStartRadius: 0.8,
  },
});

export default BottomSheets;
