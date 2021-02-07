import {W, H} from '../../../constants';

export const INPUT_MIN_HEIGHT = 0.2 * H;
export const INPUT_MAX_HEIGHT = 0.4 * H;

export const BUTTON_MIN_WIDTH = 60;
export const BUTTON_MAX_WIDTH = 180;

export const SIZE_ITERPOLATION_MS = 150;
export const COLOR_INTERPOLATION_MS = 100;

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
