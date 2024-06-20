import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {ViewStyle} from 'react-native';

interface AddBendenganSvgProps {
  style?: ViewStyle;
}

const AddBendenganSvg: React.FC<AddBendenganSvgProps> = ({style}) => {
  return (
    <Svg width="21" height="21" viewBox="0 0 21 21" fill="none" style={style}>
      <Path
        d="M10.5 0C4.70039 0 0 4.70039 0 10.5C0 16.2996 4.70039 21 10.5 21C16.2996 21 21 16.2996 21 10.5C21 4.70039 16.2996 0 10.5 0ZM16.6236 11.3736C16.6236 11.8576 16.234 12.2473 15.75 12.2473H12.2514V15.75C12.2514 16.234 11.8617 16.6236 11.3777 16.6236H9.62637C9.14238 16.6236 8.75273 16.2299 8.75273 15.75V12.2514H5.25C4.76602 12.2514 4.37637 11.8576 4.37637 11.3777V9.62637C4.37637 9.14238 4.76602 8.75273 5.25 8.75273H8.74863V5.25C8.74863 4.76602 9.13828 4.37637 9.62227 4.37637H11.3736C11.8576 4.37637 12.2473 4.77012 12.2473 5.25V8.74863H15.75C16.234 8.74863 16.6236 9.14238 16.6236 9.62227V11.3736Z"
        fill="#F24822"
      />
    </Svg>
  );
};

export default AddBendenganSvg;
