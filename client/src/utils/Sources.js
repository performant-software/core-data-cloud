// @flow
import type { SourceTitle as SourceTitleType } from '../types/SourceTitle';
import type { Source as SourceType } from '../types/Source';

/**
 * Returns the name to display for the passed source.
 *
 * @param source
 *
 * @returns {*}
 */
const getNameView = (source: SourceType) => {
  if (source) {
    const primary = source.primary_name;

    if (primary) {
      return source.primary_name.name.name;
    }

    if (source.source_titles && source.source_titles.length > 0) {
      return source.source_titles[0].name.name;
    }
  }

  return '';
};

const insertSourceTitle = (props: any, sourceTitle: SourceTitleType) => (
  props.onSetState({
    source_titles: [
      ...props.item.source_titles || [],
      sourceTitle
    ]
  })
);

export default {
  getNameView,
  insertSourceTitle
};
