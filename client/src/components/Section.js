// @flow

import React, { type Node, useContext } from 'react';
import ScrollableContext from '../context/Scrollable';

type Props = {
  id: string,
  children: Node
};

const Section = (props: Props) => {
  const { setSectionRef } = useContext(ScrollableContext);

  return (
    <section
      id={props.id}
      ref={setSectionRef}
    >
      { props.children }
    </section>
  );
};

export default Section;
