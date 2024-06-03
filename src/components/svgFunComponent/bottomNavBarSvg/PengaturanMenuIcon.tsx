import React from 'react';
import Svg, {Path, G, Defs, ClipPath, Rect, SvgProps} from 'react-native-svg';

interface CustomSvgProps extends SvgProps {
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
}

const PengaturanMenuIcon: React.FC<CustomSvgProps> = props => {
  return (
    <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <G clipPath="url(#clip0_2659_270)">
        <Path
          d="M4.22408 17.4313C3.58487 16.2438 3.26587 15.6488 3.26587 15C3.26587 14.3513 3.58487 13.7575 4.22408 12.57L5.85291 9.53751L7.57599 6.56126C8.25145 5.39501 8.58858 4.81126 9.13112 4.48626C9.67487 4.16251 10.331 4.15251 11.6445 4.13001L15 4.07501L18.3531 4.13001C19.6678 4.15251 20.3239 4.16251 20.8665 4.48751C21.4102 4.81251 21.7485 5.39501 22.4228 6.56126L24.1471 9.53751L25.7783 12.57C26.4163 13.7575 26.7353 14.3513 26.7353 15C26.7353 15.6488 26.4163 16.2425 25.7771 17.43L24.1471 20.4625L22.424 23.4388C21.7485 24.605 21.4114 25.1888 20.8689 25.5138C20.3251 25.8375 19.669 25.8475 18.3555 25.87L15 25.925L11.6469 25.87C10.3322 25.8475 9.67608 25.8375 9.13354 25.5125C8.58979 25.1875 8.25145 24.605 7.5772 23.4388L5.85291 20.4625L4.22408 17.4313Z"
          stroke={props.stroke}
          strokeWidth="2.2"
        />
        <Path
          d="M15 18.75C17.002 18.75 18.625 17.0711 18.625 15C18.625 12.9289 17.002 11.25 15 11.25C12.998 11.25 11.375 12.9289 11.375 15C11.375 17.0711 12.998 18.75 15 18.75Z"
          stroke={props.stroke}
          strokeWidth="2.2"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_2659_270">
          <Rect width="29" height="30" fill="none" transform="translate(0.5)" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default PengaturanMenuIcon;
