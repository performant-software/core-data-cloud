// @flow

import { createContext } from 'react';

type ScrollableContextType = {
  scrollContext: { current: ?HTMLElement },
  sections: Array<{ current: ?HTMLElement }>,
  setScrollContext: ({ current: ?HTMLElement}) => void,
  setSectionRef: (element: HTMLElement) => void
};

const ScrollableContext = createContext<ScrollableContextType>({
  scrollContext: undefined,
  sections: undefined,
  setScrollContext: undefined,
  setSectionRef: undefined
});

export default ScrollableContext;
