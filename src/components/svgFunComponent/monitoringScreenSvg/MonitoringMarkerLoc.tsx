import React from 'react';
import Svg, {Path} from 'react-native-svg';

const MonitoringMarkerLoc: React.FC = () => {
  return (
    <Svg width="11%" height="100%" viewBox="0 0 15 16" fill="none">
      <Path
        d="M7.33339 1C4.39272 1 2.00005 3.54221 2.00005 6.66312C1.98072 11.2283 7.13072 15.0137 7.33339 15.1667C7.33339 15.1667 12.6861 11.2283 12.6667 6.66667C12.6667 3.54221 10.2741 1 7.33339 1ZM7.33339 9.5C5.86005 9.5 4.66672 8.23208 4.66672 6.66667C4.66672 5.10125 5.86005 3.83333 7.33339 3.83333C8.80672 3.83333 10.0001 5.10125 10.0001 6.66667C10.0001 8.23208 8.80672 9.5 7.33339 9.5Z"
        fill="#F61B1B"
      />
    </Svg>
  );
};

export default MonitoringMarkerLoc;
