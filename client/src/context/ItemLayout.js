// @flow

import { createContext } from 'react';

type ItemLayoutContextType = {
  saved: boolean,
  setSaved: () => void
};

const ItemLayoutContext = createContext<ItemLayoutContextType>({
  saved: false,
  setSaved: undefined
});

export default ItemLayoutContext;
