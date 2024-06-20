import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

interface ButtonNavigationSvgProps {
  style?: ViewStyle;
}

const ButtonNavigation: React.FC<ButtonNavigationSvgProps> = ({style}) => {
  return (
    <Svg width="9" height="13" viewBox="0 0 9 13" fill="none" style={style}>
      <Path
        d="M1.26251 1.26294L7.03751 6.37622L1.26251 11.4895"
        stroke="#155743"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ButtonNavigation;
