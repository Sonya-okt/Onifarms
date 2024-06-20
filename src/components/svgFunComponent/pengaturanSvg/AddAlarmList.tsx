import React from 'react';
import Svg, {ClipPath, Defs, G, Path, Rect} from 'react-native-svg';

const AddAlarmList: React.FC = () => {
  return (
    <Svg width="60%" height="60%" viewBox="0 0 26 26" fill="none">
      <Path
        d="M20.7188 12.5938H4.46875M12.5938 4.46875V20.7188"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default AddAlarmList;
