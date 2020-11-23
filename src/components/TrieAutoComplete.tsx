import React, {FunctionComponent, useEffect, useState} from 'react';
import {View, Text, TextInput, TouchableHighlight} from 'react-native';
import styled from 'styled-components/native';

import TrieSearch from 'trie-search';

type TrieAutoCompleteProps = {
  fullOptionsMap: Record<string, any>;

  placeholder?: string;
  input: string;
  onInputChange: (newInput: string) => void;
  handleSelect: (option: string) => void;
};
export const TrieAutoComplete: FunctionComponent<TrieAutoCompleteProps> = (
  props,
) => {
  const {
    fullOptionsMap,
    placeholder = 'Enter...',
    input,
    onInputChange,
    handleSelect,
  } = props;

  const [ts, setTs] = useState(new TrieSearch());
  const [filteredOptions, setFilteredOptions] = useState<Array<string>>([]);

  useEffect(() => {
    setTs(new TrieSearch());

    ts.addFromObject(fullOptionsMap);
  }, [fullOptionsMap]);

  useEffect(() => {
    const filtered = ts.get(input);

    setFilteredOptions(filtered);
  }, [input, fullOptionsMap]);

  const _handleSelect = (option: string) => {
    handleSelect(option); // Select
    onInputChange(''); // Clear
  };

  return (
    <View>
      <StyledTextInput
        placeholder={placeholder}
        onChangeText={onInputChange}
        value={input}
      />

      {filteredOptions.map((option) => (
        <Option onPress={() => _handleSelect(option)}>
          <Text>{option}</Text>
        </Option>
      ))}
    </View>
  );
};

const StyledTextInput = styled.TextInput``;

const Option = styled.TouchableHighlight``;
