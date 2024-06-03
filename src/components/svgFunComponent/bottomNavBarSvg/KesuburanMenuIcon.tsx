import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

interface CustomSvgProps extends SvgProps {
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
}

const KesuburanMenuIcon: React.FC<CustomSvgProps> = props => {
  return (
    <Svg width="25" height="26" viewBox="0 0 25 26" fill="none">
      <Path
        d="M12.5 13H16.1667C18.1116 13 19.9769 12.1923 21.3521 10.7545C22.7274 9.31671 23.5 7.36666 23.5 5.33333V4.05556H19.8333C17.8884 4.05556 16.0232 4.86329 14.6479 6.30107C13.2726 7.73885 12.5 9.6889 12.5 11.7222H8.83333C6.88841 11.7222 5.02315 10.9145 3.64788 9.47671C2.27262 8.03893 1.5 6.08888 1.5 4.05556V1.5H5.16667C7.11159 1.5 8.97685 2.30774 10.3521 3.74551C11.7274 5.18329 12.5 7.13334 12.5 9.16667V16.8333M6.38889 16.8333H18.6111V21.9444C18.6111 22.6222 18.3536 23.2722 17.8951 23.7515C17.4367 24.2308 16.815 24.5 16.1667 24.5H8.83333C8.18503 24.5 7.56327 24.2308 7.10485 23.7515C6.64643 23.2722 6.38889 22.6222 6.38889 21.9444V16.8333Z"
        stroke={props.stroke}
        strokeWidth={'2'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default KesuburanMenuIcon;
