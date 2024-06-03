import React from 'react';
import {SvgProps} from 'react-native-svg';
import MonitoringCircle from '../components/images/monitoringImage/monitoringCircle.svg';
import MonitoringMarkLoc from '../components/images/monitoringImage/monitoringMarkerLoc.svg';

export const MonitoringCircleSvg: React.FC<SvgProps> = props => (
  <MonitoringCircle {...props} />
);

export const MonitoringMarkLocSvg: React.FC<SvgProps> = props => (
  <MonitoringMarkLoc {...props} />
);
