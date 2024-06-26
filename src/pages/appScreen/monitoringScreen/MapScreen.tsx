import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Color, FontFamily} from '../../../constants/GlobalStyles';
import {Rows, Table} from 'react-native-table-component';

const MapScreen = () => {
  const tableData = [
    ['Suhu', ':', '25', '°C'],
    ['Kelembapan', ':', '65', '%'],
    ['pH', ':', '6'],
    ['Nitrogen', ':', '1000', 'ppm'],
    ['Phosphor', ':', '100', 'ppm'],
    ['Kalium', ':', '100', 'ppm'],
  ];

  const columnWidths = [wp('25%'), wp('10%'), wp('8%'), wp('10%')]; // Lebar kolom disesuaikan

  return (
    <View style={{flex: 1, marginTop: hp('2%')}}>
      <View style={styles.accordionBody}>
        <View
          style={{
            height: hp('3.8%'),
            width: '100%',
            backgroundColor: Color.PRIMARY,
            paddingHorizontal: wp('3.5%'),
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: FontFamily.poppinsSemiBold,
              fontSize: wp('3.5%'),
              color: Color.WHITE,
            }}>
            Node 1
          </Text>
        </View>

        <Table
          style={{
            paddingHorizontal: wp('3%'),
            marginTop: hp('1%'),
          }}>
          <Rows
            data={tableData}
            style={styles.row}
            textStyle={styles.text}
            widthArr={columnWidths}
          />
        </Table>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  accordionBody: {
    backgroundColor: Color.WHITE,
    width: wp('89.7%'),
    height: hp('25%'),
    alignSelf: 'center',
    borderRadius: wp('5%'),
    overflow: 'hidden',
  },
  row: {
    height: hp('3%'), // Mengatur tinggi baris
    paddingHorizontal: wp('1%'),
  },
  text: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: 11,
    color: Color.PRIMARY,
  },
});

export default MapScreen;
