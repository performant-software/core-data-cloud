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
  getTimestamp
};
