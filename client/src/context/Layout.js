// @flow

import { createContext } from 'react';

type LayoutContextType = {
  contentPadding: ?number,
  menuBarHeight: ?number,
};

const LayoutContext = createContext<LayoutContextType>({
  contentPadding: null,
  menuBarHeight: null
});

export default LayoutContext;
