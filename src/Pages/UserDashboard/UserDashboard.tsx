import React, {FC} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {RealmInterface} from '../../../realm/Realm';

type UserDashboardProps = {};

export const UserDashboard: FC<UserDashboardProps> = (props) => {
  const dispatch = useDispatch();

  const {user} = useSelector((state) => state);

  return <View></View>;
};
