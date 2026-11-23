// @flow

import { createContext } from 'react';

type MessageType = {
  content: string,
  header: string
};

type ItemLayoutContextType = {
  message: ?MessageType,
  saved: boolean,
  setMessage: (message: ?MessageType) => void,
  setSaved: () => void
};

const ItemLayoutContext = createContext<ItemLayoutContextType>({
  message: null,
  saved: false,
  setMessage: undefined,
  setSaved: undefined
});

export default ItemLayoutContext;
