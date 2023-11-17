// @flow
import type { SourceTitle as SourceTitleType } from '../types/SourceTitle';

const insertSourceTitle = (props: any, sourceTitle: SourceTitleType) => {
  // If there's no source_titles array at all, we can create it.
  if (!props.item.source_titles) {
    return props.onSetState({
      source_titles: [sourceTitle]
    });
  }

  return props.onSetState({
    source_titles: [
      ...props.item.source_titles,
      sourceTitle
    ]
  });
};

export default {
  insertSourceTitle
};
