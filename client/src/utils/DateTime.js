// @flow

const MS_TO_HOURS = 1000 * 60 * 60;

/**
 * Returns the duration (in hours) of the passed date string.
 *
 * @param value
 *
 * @returns {number}
 */
const getDurationInHours = (value: string) => {
  const date = new Date(value);
  const duration = Date.now() - date;

  return duration / MS_TO_HOURS;
};

/**
 * Returns the formatted timestamp for the passed value.
 *
 * @param value
 *
 * @returns {string|null}
 */
const getTimestamp = (value: number) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

export default {
  getDurationInHours,
  getTimestamp
};
