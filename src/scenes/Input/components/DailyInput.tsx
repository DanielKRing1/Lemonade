// Npm
import React, {FC, useCallback, useMemo, useState} from 'react';
import {Text, View, TouchableHighlight} from 'react-native';
import {ActionCreatorWithPayload} from '@reduxjs/toolkit';
import {connect} from 'react-redux';
import styled from 'styled-components/native';
import axios from 'axios';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';

// Components
import {Cycle, withCycleContainer, ChildProps} from '../../../components/Cycle';
import {RatingInput} from '../../../components';

// Redux
import {
  rateDay,
  setMood,
  setMoodIntensity,
  addActivity,
  setActivities,
} from '../../../redux/slices';
import {
  DayPart as DayPartState,
  DaysTrackerState,
  Day,
  Days,
} from '../../../redux/slices';

// Util + constants
import {EndPoint} from '../../../util/Request';
import {uuid} from '../../../util';
import {W, H, ButtonColors} from '../../../constants';

const RATING_INPUT_INTEGER_WARNING = 'Please enter an integer rating';
const RATING_INPUT_BOUNDS_WARNING = 'Please enter a rating between 0 and 10';

class Activity {
  name: string;
  id: string;

  constructor(name: string) {
    this.name = name;
    this.id = uuid(5);
  }
}

type TextInputFields = {
  placeholder: string;
  handleChangeInput: (text: string) => void;
};

type BaseDailyInputProps = {
  mood: string;
  moodIntensity: string;
  activities: Array<string>;

  localDays: Days;
  serverDays: Days;

  rateDay: ActionCreatorWithPayload<
    {mood: string; moodIntensity: string; activities: Array<string>},
    string
  >;

  setMood: ActionCreatorWithPayload<string, string>;
  setMoodIntensity: ActionCreatorWithPayload<string, string>;
  addActivity: ActionCreatorWithPayload<string, string>;
  setActivities: ActionCreatorWithPayload<Array<string>, string>;
};

const BaseDailyInput: FC<BaseDailyInputProps> = (props) => {
  const {
    mood,
    moodIntensity,
    activities,
    localDays,
    serverDays,
    rateDay,
    setMood,
    setMoodIntensity,
    addActivity,
    setActivities,
  } = props;

  // TODO
  // Replace myActivities with redux activities
  const [activity, setActivity] = useState<string>('');
  const [myActivities, setMyActivities] = useState<Array<Activity>>([
    new Activity('Run'),
    new Activity('Have fun'),
    new Activity('Sleep'),
    new Activity('Create'),
    new Activity('Victoria time!'),
    new Activity('Persuade them'),
  ]);
  // const [myActivities, setMyActivities] = useState<Array<Activity>>(activities.map(a => new Activity(a)));
  const [myMood, setMyMood] = useState<string>('');
  const [myIntensity, setMyIntensity] = useState<string>('');
  const [myIntensityWarnings, setMyIntensityWarnings] = useState<Set<string>>(
    new Set(),
  );

  const handleAddActivity = (inputActivity: string) => {
    console.log('Add activity');
    console.log(inputActivity);

    console.log(activity);

    setActivity(inputActivity);

    // const newActivity = new Activity(inputActivity);
    // setMyActivities([...myActivities, newActivity]);
    // addActivity(newActivity.name);
  };
  const handleSetMood = (inputMood: string) => {
    console.log('Mood changed');
    console.log(mood);
    console.log(inputMood);

    // setMyMood(inputMood);
    setMood(inputMood);
  };

  const handleSetIntensity = (inputIntensity: string) => {
    console.log(inputIntensity);

    // setMyIntensity(inputIntensity);

    const intensityNum = Number(inputIntensity);

    if (!Number.isInteger(intensityNum)) {
      console.log('Not int');

      setMyIntensityWarnings((prevState) =>
        prevState.add(RATING_INPUT_INTEGER_WARNING),
      );
    } else if (intensityNum < 0 || intensityNum > 10) {
      console.log('Out of bounds');

      setMyIntensityWarnings((prevState) =>
        prevState.add(RATING_INPUT_BOUNDS_WARNING),
      );

      setMyIntensityWarnings((prevState) => {
        prevState.delete(RATING_INPUT_INTEGER_WARNING);
        return prevState;
      });
    } else {
      console.log('All good');

      setMyIntensityWarnings((prevState) => new Set<string>());
      // setMyIntensity(inputIntensity);
      setMoodIntensity(inputIntensity);
    }
  };

  const INPUT_FIELDS: Array<TextInputFields> = [
    {
      placeholder: 'What did you do?',
      handleChangeInput: handleAddActivity,
    },
    {
      placeholder: 'How intense is the feeling?',
      handleChangeInput: handleSetIntensity,
    },
    {
      placeholder: 'How do you feel?',
      handleChangeInput: handleSetMood,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const inputs: Array<string> = [activity, moodIntensity, mood];

  const handleCyclePress = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % INPUT_FIELDS.length);
  };
  const currentInputFields = INPUT_FIELDS[activeIndex];
  const {placeholder, handleChangeInput}: TextInputFields = currentInputFields;
  const input = inputs[activeIndex];
  console.log(activeIndex);
  console.log(input);

  // Save current Day Part to Redux
  const handleReduxStore = () => {};
  // Submit Redux Day Part to Lambda
  const handleSubmit = () => {
    // TODO Save to redux

    // TODO complete, add thunk
    rateDay({
      mood,
      moodIntensity,
      activities,
    });
    // TODO add to rateDay
    // axios.post(EndPoint.RATE_DAY, {});
  };

  const keyExtractor = useCallback(
    (item, index) => `my-activity-${item.id}`,
    [],
  );
  const onDragEnd = useCallback(({data}) => setActivities(data), []);

  return (
    <CycleList
      placeholder={placeholder}
      input={input}
      handleChangeInput={handleChangeInput}
      onCycle={handleCyclePress}
      onSubmit={handleSubmit}
      mood={mood}
      moodIntensity={moodIntensity}
      data={myActivities}
      keyExtractor={keyExtractor}
      onDragEnd={onDragEnd}
    />
  );
};

// TODO
// Possibly refactor to exist directly in BaseDailyInput, wrapped in withCycleContainer
interface ListProps extends ChildProps {
  mood: string;
  moodIntensity: string;

  data: Array<Activity>;
  keyExtractor: (item: Activity, index: number) => string;
  onDragEnd: (arg: any) => any;
}
const List: FC<ListProps> = (props) => {
  const {
    mood,
    moodIntensity,
    data,
    keyExtractor,
    onDragEnd,
    isFocused,
    onScrollUp,
    onScrollDown,
  } = props;

  const SCROLL_THRESHOLD = 10;
  const [scrollOffset, setScrollOffset] = useState<number>(0);

  const handleScrollOffsetChange = (newOffset: number) => {
    const scrollDelta = newOffset - scrollOffset;
    if (scrollDelta > SCROLL_THRESHOLD && isFocused) {
      setScrollOffset(newOffset);
      onScrollDown();
    } else if (scrollDelta < -SCROLL_THRESHOLD && !isFocused) {
      setScrollOffset(newOffset);
      onScrollUp();
    }
  };

  return (
    <>
      <RatingInput handleRate={} />
      <Text>Mood: {mood}</Text>
      <Text>Intensity: {moodIntensity}</Text>
      <DraggableFlatList
        style={{flex: 1, width: W}}
        data={data}
        renderItem={ActivityRow}
        keyExtractor={keyExtractor}
        onDragEnd={onDragEnd}
        onScrollOffsetChange={handleScrollOffsetChange}
      />
    </>
  );
};
const CycleList = withCycleContainer<ListProps>(List);

const ActivityRow: FC<RenderItemParams<Activity>> = (props) => {
  const {item, index, drag, isActive} = props;

  return (
    <TouchableHighlight
      underlayColor={ButtonColors.press}
      style={{
        flex: 1,
        width: '100%',
        height: 100,
        backgroundColor: isActive ? ButtonColors.active : ButtonColors.neutral,
        borderRadius: isActive ? 10 : 0,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onLongPress={drag}>
      <Text
        style={{
          fontWeight: 'bold',
          color: 'lavender',
          fontSize: 32,
        }}>
        {item.name}
      </Text>
    </TouchableHighlight>
  );
};

const mapStateToProps = (state: {
  dayPart: DayPartState;
  days: DaysTrackerState;
}) => {
  const {dayPart, days} = state;

  const {mood, moodIntensity, activities} = dayPart;
  const {local, server} = days;

  return {
    mood,
    moodIntensity,
    activities,
    localDays: local,
    serverDays: server,
  };
};

const mapDispatch = {
  rateDay,
  setMood,
  setMoodIntensity,
  addActivity,
  setActivities,
};

export const DailyInput = connect(mapStateToProps, mapDispatch)(BaseDailyInput);
