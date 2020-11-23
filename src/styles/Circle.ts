import { Dimensions } from 'react-native';

export const CircleStyle = `
    borderRadius: ${Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2};
    
    justifyContent: center;
    alignItems: center;
`;