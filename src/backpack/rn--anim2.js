import * as React from "react";
import {
  Button,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import Constants from "expo-constants";
import styled from "styled-components/native";

import Animated, {
  withSpring,
  withTiming,
  Easing,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

// You can import from local files
import AssetExample from "./components/AssetExample";

// or any pure javascript modules available in npm
// import { Card } from 'react-native-paper';

// CUSTOM HOOK

const useActiveIndex = (activeValue, inactiveValue) => {
  const DEFAULT_INDEX = -1;

  const [activeIndex, setActiveIndex] = React.useState(DEFAULT_INDEX);

  const updateIndex = (index) => {
    if (index !== activeIndex) setActiveIndex(index);
  };

  const getIndexValue = (index) => {
    if (index === activeIndex) return activeValue;
    else return inactiveValue;
  };

  return {
    activeIndex,
    updateIndex,
    getIndexValue,
  };
};

const useActiveIndexWIdle = (activeValue, inactiveValue, idleValue) => {
  const IDLE_INDEX = -1;

  const { activeIndex, updateIndex, getIndexValue } = useActiveIndex(
    activeValue,
    inactiveValue
  );

  const setToIdle = (index) => {
    updateIndex(IDLE_INDEX);
  };

  const getIndexValueWIdle = (index) => {
    if (activeIndex === IDLE_INDEX) return idleValue;
    else return getIndexValue(index);
  };

  return {
    activeIndex,
    updateIndex,
    getIndexValue: getIndexValueWIdle,
    setToIdle,
  };
};

export default function App() {
  console.log("abbbbc");
  console.log(Dimensions.get("window").width);
  const ACTIVE_VAL = {
    width: Dimensions.get("window").width / 100,
    height: Dimensions.get("window").height / 100,
  };
  const INACTIVE_VAL = {
    width: 0.5,
    height: 0.5,
  };
  const IDLE_VAL = {
    width: 1,
    height: 1,
  };
  const {
    activeIndex,
    updateIndex,
    getIndexValue,
    setToIdle,
  } = useActiveIndexWIdle(ACTIVE_VAL, INACTIVE_VAL, IDLE_VAL);

  const handlePress = (index) => {
    if (index === activeIndex) {
      setToIdle();
    } else updateIndex(index);
  };

  console.log("this");
  console.log(getIndexValue(1));

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        Change code in the editor and watch it change on your phone! Save to get
        a shareable url.
      </Text>

      <FlexRow>
        <Card
          handlePress={() => handlePress(0)}
          w={getIndexValue(0).width}
          h={getIndexValue(0).height}
        >
          <Text>Hi</Text>
        </Card>
        <Card
          handlePress={() => handlePress(1)}
          w={getIndexValue(1).width}
          h={getIndexValue(1).height}
        >
          <Text>Hi</Text>
        </Card>
      </FlexRow>
    </View>
  );
}

const Card = (props) => {
  const { children, handlePress, w, h } = props;

  console.log(`Box width: ${w}, height: ${h}`);

  const width = useSharedValue(w);
  const height = useSharedValue(h);

  const width2 = useSharedValue(1 / w);
  const height2 = useSharedValue(1 / h);

  React.useEffect(() => {
    console.log("useEffect");
    console.log(width);
    console.log(height);

    width.value = withTiming(w, {
      duration: 250,
      easing: Easing.inOut(Easing.exp),
    });

    height.value = withTiming(h, {
      duration: 250,
      easing: Easing.inOut(Easing.exp),
    });

    width2.value = withTiming(1 / w, {
      duration: 250,
      easing: Easing.inOut(Easing.exp),
    });

    height2.value = withTiming(1 / h, {
      duration: 250,
      easing: Easing.inOut(Easing.exp),
    });
  }, [w, h]);
  const customSpringStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scaleX: width.value,
        },
        {
          scaleY: height.value,
        },
      ],
    };
  });

  const customSpringStyles2 = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scaleX: width2.value,
        },
        {
          scaleY: height2.value,
        },
      ],
    };
  });

  return (
    <StyledContainer style={[customSpringStyles]}>
      <Animated.View style={[customSpringStyles2]}>
        <StyledTouchableNativeFeedback onPress={handlePress}>
          <View>{children}</View>
        </StyledTouchableNativeFeedback>
      </Animated.View>
    </StyledContainer>
  );
};

const StyledContainer = styled(Animated.View)`
  display: flex;
  align-self: flex-start;

  background-color: white;
  border-radius: 10px;

  border-width: 10px;
  border-color: yellow;

  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.8,
  shadow-radius: 2px;

  elevation: 5px;
`;

const StyledTouchableNativeFeedback = styled.TouchableOpacity`
  width: 100%;
  height: 50%;
  padding: 10px;

  background-color: White;
  border-radius: 10px;
`;

const FlexRow = styled.View`
  display: flex;
  flex-direction: row;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
