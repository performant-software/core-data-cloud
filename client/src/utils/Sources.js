// @flow
import type { SourceTitle as SourceTitleType } from '../types/SourceTitle';

const insertSourceTitle = (props: any, sourceTitle: SourceTitleType) => (
  props.onSetState({
    source_titles: [
      ...props.item.source_titles || [],
      sourceTitle
    ]
  })
);

export default {
  insertSourceTitle
};
