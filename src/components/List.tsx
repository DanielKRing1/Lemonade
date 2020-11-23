import React, { FC } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';

export type Item = {
  key: string;
  backgroundColor: string;
  text: string;
};
type ListProps = {
  data: Array<Item>;
  setData: (data: Array<Item>) => void;
  renderItem: (params: RenderItemParams<Item>) => React.ReactNode;
};
export const List: FC<ListProps> = (props) => {
  const { data, setData, renderItem } = props;

  console.log(data);

  return (
    <View style={{ flex: 1 }}>
      <DraggableFlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `draggable-item-${item.key}`}
        onDragEnd={({ data: newData }) => setData(newData)}
      />
    </View>
  );
}
