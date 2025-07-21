// @flow

const FIELD_DELIMITER = ';';
const FILENAME_ATTRIBUTE = 'filename=';

/**
 * Returns the filename for the passed "content-disposition" header.
 *
 * @param disposition
 *
 * @returns {string}
 */
const getFilename = (disposition: string): ?string => (
  disposition
    .split(FIELD_DELIMITER)
    .find((name) => name.includes(FILENAME_ATTRIBUTE))
    ?.replace(FILENAME_ATTRIBUTE, '')
    ?.replaceAll('"', '')
    ?.trim()
);

export default {
  getFilename
};
