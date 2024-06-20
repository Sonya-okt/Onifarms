import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {ViewStyle} from 'react-native';

interface AddPhotoSvgProps {
  style?: ViewStyle;
}

const AddPhoto: React.FC<AddPhotoSvgProps> = ({style}) => {
  return (
    <Svg width="20%" height="20%" viewBox="0 0 17 17" fill="none" style={style}>
      <Path
        d="M8.5 1.0625C6.53486 1.08634 4.65692 1.87759 3.26726 3.26726C1.87759 4.65692 1.08634 6.53486 1.0625 8.5C1.08634 10.4651 1.87759 12.3431 3.26726 13.7327C4.65692 15.1224 6.53486 15.9137 8.5 15.9375C10.4651 15.9137 12.3431 15.1224 13.7327 13.7327C15.1224 12.3431 15.9137 10.4651 15.9375 8.5C15.9137 6.53486 15.1224 4.65692 13.7327 3.26726C12.3431 1.87759 10.4651 1.08634 8.5 1.0625ZM12.75 9.03125H9.03125V12.75H7.96875V9.03125H4.25V7.96875H7.96875V4.25H9.03125V7.96875H12.75V9.03125Z"
        fill="#45977F"
      />
      <Path
        d="M12.75 9.03125H9.03125V12.75H7.96875V9.03125H4.25V7.96875H7.96875V4.25H9.03125V7.96875H12.75V9.03125Z"
        fill="white"
      />
    </Svg>
  );
};

export default AddPhoto;
