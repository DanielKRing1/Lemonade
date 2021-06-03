import {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {GestureResponderEvent} from 'react-native';

import {ClickListenerContext} from '../components/Global/ClickListener';

export const useOnClickOutsideComponent = (listenerId: string) => {
  const [clickedInside, setClickedInside] = useState(false);
  const [clickedInsideCount, setClickedInsideCount] = useState(0);

  const ref = useRef();
  const {addClickListener, rmClickListener} = useContext(ClickListenerContext);

  const handleClick = useCallback(
    (e: GestureResponderEvent) => {
      if (ref && ref.current && ref.current.contains(e.target)) {
        setClickedInside(true);
        setClickedInsideCount(clickedInsideCount + 1);
      } else reset();
    },
    [clickedInsideCount],
  );

  useEffect(() => {
    addClickListener(listenerId, handleClick);

    return () => rmClickListener(listenerId);
  }, [addClickListener, handleClick, listenerId, ref, rmClickListener]);

  const reset = () => {
    setClickedInside(false);
    setClickedInsideCount(0);
  };

  return {
    ref,
    clickedInside,
    clickedInsideCount,
    reset,
  };
};
