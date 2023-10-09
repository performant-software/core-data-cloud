// @flow

import { createContext } from 'react';
import type { Organization as OrganizationType } from '../types/Organization';
import type { Person as PersonType } from '../types/Person';
import type { Place as PlaceType } from '../types/Place';

type RecordType = OrganizationType | PersonType | PlaceType;

type CurrentRecordContextType = {
  currentRecord: RecordType,
  name: string,
  setCurrentRecord: (currentRecord: RecordType) => void,
  setType: (type: string) => void,
  type: string
};

const CurrentRecordContext = createContext<CurrentRecordContextType>({
  currentRecord: undefined,
  name: undefined,
  setCurrentRecord: undefined,
  setType: undefined,
  type: undefined
});

export default CurrentRecordContext;
