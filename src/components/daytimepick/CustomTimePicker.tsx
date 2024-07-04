import React, {useState} from 'react';
import {Modal, View, TouchableOpacity, Text} from 'react-native';
import {Picker} from '@react-native-picker/picker'; // Import dari picker baru

interface CustomTimePickerProps {
  isVisible: boolean;
  onConfirm: (time: string) => void;
  onCancel: () => void;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  isVisible,
  onConfirm,
  onCancel,
}) => {
  const [selectedHour, setSelectedHour] = useState('00');
  const [selectedMinute, setSelectedMinute] = useState('00');

  const handleConfirm = () => {
    onConfirm(`${selectedHour}:${selectedMinute}`);
  };

  return (
    <Modal transparent={true} visible={isVisible} animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
        <View
          style={{
            width: '80%',
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 20,
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 18, marginBottom: 10}}>Select Time</Text>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Picker
              selectedValue={selectedHour}
              style={{height: 50, width: 100}}
              onValueChange={(itemValue: string) => setSelectedHour(itemValue)}>
              {Array.from({length: 24}, (_, i) => (
                <Picker.Item
                  key={i}
                  label={i.toString().padStart(2, '0')}
                  value={i.toString().padStart(2, '0')}
                />
              ))}
            </Picker>
            <Text>:</Text>
            <Picker
              selectedValue={selectedMinute}
              style={{height: 50, width: 100}}
              onValueChange={(itemValue: string) =>
                setSelectedMinute(itemValue)
              }>
              {Array.from({length: 60}, (_, i) => (
                <Picker.Item
                  key={i}
                  label={i.toString().padStart(2, '0')}
                  value={i.toString().padStart(2, '0')}
                />
              ))}
            </Picker>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
              marginTop: 20,
            }}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={{fontSize: 18, color: 'red'}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={{fontSize: 18, color: 'green'}}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomTimePicker;
