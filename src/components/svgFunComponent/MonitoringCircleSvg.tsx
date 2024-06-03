import React from 'react';
import Svg, {Circle} from 'react-native-svg';
import {ViewStyle} from 'react-native';

interface MonitoringCircleSvgProps {
  style?: ViewStyle; // Tambahkan properti style
}

const MonitoringCircleSvg: React.FC<MonitoringCircleSvgProps> = ({style}) => {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 128 128"
      fill="none"
      style={style}>
      <Circle cx="64" cy="63" r="63" fill="#D9D9D9" />
    </Svg>
  );
};

export default MonitoringCircleSvg;
