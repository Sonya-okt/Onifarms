import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {ViewStyle} from 'react-native';

interface BackIconProps {
  style?: ViewStyle; // Tambahkan properti style
}

const BackIcon: React.FC<BackIconProps> = ({style}) => {
  return (
    <Svg width="19" height="19" viewBox="0 0 20 20" fill="none" style={style}>
      <Path
        d="M20 8.75H4.7875L11.775 1.7625L10 0L0 10L10 20L11.7625 18.2375L4.7875 11.25H20V8.75Z"
        fill="#155743"
      />
    </Svg>
  );
};

export default BackIcon;
