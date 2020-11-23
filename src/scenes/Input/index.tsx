import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import {
  Button,
  Dimensions,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';


import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';

import { ButtonColors } from '../../constants/themes';

import { DailyInput } from './components';
import { TrieAutoComplete, List, Item } from '../../components';

import { activityAliasMap, emotionAliasMap } from '../../constants';

import { EndPoint, getJwt, getIsLoggedIn } from '../../util';

import { AppTabParamList, Screen } from '../Types';

import * as Test from '../../realm/Activity/actions';


type HomeNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<AppTabParamList, Screen.Home>
>;

type HomeProps = {
  navigation: HomeNavigationProp;
};
export const Home: FunctionComponent<HomeProps> = (props) => {
  const { navigation } = props;

  useEffect(() => {
    const getJwtWrapper = async () => {
      console.log('About to get Jwt');
      try {
        const jwt = await getJwt();

        console.log(jwt);
      } catch (err) {
        console.log(err);
      }
    };
    getJwtWrapper();

    Test.createTest();
  }, []);


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>


      <DailyInput />

      {/* {myActivities.length > 0 && (
        <FlexColumn>
          {myActivities.map((myActivity) => (
            <SelectionRow
              itemName={myActivity}
              onDeselect={() =>
                setMyActivities(myActivities.filter((a) => a !== myActivity))
              }
            />
          ))}
        </FlexColumn>
      )}

      <TrieAutoComplete
        fullOptionsMap={Object.keys(activityAliasMap)}
        placeholder="What did you do?"
        input={activityInput}
        onInputChange={setActivityInput}
        handleSelect={handleSelectActivity}
      />

      {!!myEmotion && (
        <>
          <SelectionRow
            itemName={myEmotion}
            onDeselect={() => setMyEmotion('')}
          />
        </>
      )}
      <TrieAutoComplete
        fullOptionsMap={Object.keys(emotionAliasMap)}
        placeholder="How do you feel?"
        input={emotionInput}
        onInputChange={setEmotionInput}
        handleSelect={handleSelectEmotion}
      />

      {!!myRating ? (
        <Text>My rating: {myRating}</Text>
      ) : (
          <Text>No rating yet</Text>
        )}

      <TextInput
        keyboardType="number-pad"
        placeholder="How intense is your mood?"
        value={ratingInput}
        onChangeText={handleSetInputRating}
      />

      {ratingInputWarnings.size > 0 &&
        [...ratingInputWarnings].map((warning: string) => (
          <Text>{warning}</Text>
        ))}

      <Button title="Rate" onPress={() => handleSelectRating(ratingInput)} />

      <Button title="Save My Day!" onPress={handleSubmit} /> */}
    </View>
  );
};

type SelectionRowProps = {
  itemName: string;

  onDeselect: (itemName: string) => void;
};
const SelectionRow: React.FC<SelectionRowProps> = (props) => {
  const { itemName, onDeselect } = props;

  return (
    <FlexRow>
      <Text>{itemName}</Text>

      <TouchableHighlight onPress={() => onDeselect(itemName)}>
        <Text>X</Text>
      </TouchableHighlight>
    </FlexRow>
  );
};

const FlexColumn = styled.View`
  display: flex;
  flex-direction: column;

  padding: 5% 0;
`;

const FlexRow = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;

  padding: 0 10%;
`;
