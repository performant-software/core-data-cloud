// @flow

import { createContext } from 'react';

type ItemContextType = {
  uuid: string
};

const ItemContext = createContext<ItemContextType>({
  uuid: undefined
});

export default ItemContext;
