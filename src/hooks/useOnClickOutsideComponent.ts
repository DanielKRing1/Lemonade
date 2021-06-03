# Implementation

import {useContext, useEffect, useRef, useState} from 'react';

import {ClickListenerContext} from '../components/ClickListener';

export const useOnClickOutsideComponent = (listenerId) => {
  const [clickedInside, setClickedInside] = useState(false);
  const [clickedInsideCount, setClickedInsideCount] = useState(0);

  const { addClickListener, rmClickListener } = useContext(ClickListenerContext);

  const ref = useRef();

  const handleClick = (e) => {
    if (ref.current && ref.current.contains(e.target)) {
      setClickedInside(true);
      setClickedInsideCount(clickedInsideCount + 1);
    } else reset();
  }

  const reset = () => {
    setClickedInside(false);
    setClickedInsideCount(0);
  };

  useEffect(() => {
    addClickListener(listenerId, handleClick);

    rmClickListener(listenerId);
  }, [ref, ref.current]);

  return {
    ref,
    clickedInside,
    clickedInsideCount,
    reset
  }

}
