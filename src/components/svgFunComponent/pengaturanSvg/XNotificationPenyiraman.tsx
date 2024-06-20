import React from 'react';
import Svg, {Path} from 'react-native-svg';

const XNotificationPenyiraman: React.FC = () => {
  return (
    <Svg width="65%" height="65%" viewBox="0 0 12 12" fill="none">
      <Path
        d="M11 1L1 11M1 1L11 11"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default XNotificationPenyiraman;
