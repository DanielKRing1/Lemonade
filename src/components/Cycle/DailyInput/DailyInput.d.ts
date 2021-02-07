declare type TextInputFields = {
  placeholder: string;
  onSubmit: (text: string) => void;
};

declare type AnimationParams = {
  min: number;
  max: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
};
