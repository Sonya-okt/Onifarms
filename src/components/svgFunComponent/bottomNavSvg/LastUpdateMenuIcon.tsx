import React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

interface CustomSvgProps extends SvgProps {
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
}

const LastUpdateMenuIcon: React.FC<CustomSvgProps> = props => {
  return (
    <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
      <Path
        d="M12.5 4.75V12H17.9375M23.375 12C23.375 13.4281 23.0937 14.8423 22.5472 16.1617C22.0007 17.4811 21.1996 18.6799 20.1898 19.6898C19.1799 20.6996 17.9811 21.5007 16.6617 22.0472C15.3423 22.5937 13.9281 22.875 12.5 22.875C11.0719 22.875 9.65773 22.5937 8.33832 22.0472C7.0189 21.5007 5.82005 20.6996 4.81021 19.6898C3.80038 18.6799 2.99933 17.4811 2.45281 16.1617C1.90629 14.8423 1.625 13.4281 1.625 12C1.625 9.11577 2.77076 6.34967 4.81021 4.31021C6.84967 2.27076 9.61577 1.125 12.5 1.125C15.3842 1.125 18.1503 2.27076 20.1898 4.31021C22.2292 6.34967 23.375 9.11577 23.375 12Z"
        stroke={props.stroke}
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default LastUpdateMenuIcon;
