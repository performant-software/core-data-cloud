// @flow

const DEFAULT_FILE_ENCODING = 'UTF-8';
const FILE_TYPE_JSON = 'application/json';
const FILE_TYPE_TEXT = 'text/plain';

/**
 * Creates a blob URL for the passed data object.
 *
 * @param data
 * @param type
 * @param encoding
 *
 * @returns {string}
 */
const createUrl = (data, type, encoding) => {
  const blob = new Blob([data], { type, encoding });
  const url = URL.createObjectURL(blob);

  return url;
};

/**
 * Helper function to convert the passed data to a URL and download it as a file.
 *
 * @param data
 * @param name
 * @param type
 * @param encoding
 */
const downloadFile = (data, name, type, encoding = DEFAULT_FILE_ENCODING) => {
  const url = createUrl(data, type, encoding);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

/**
 * Converts the passed data into a blob URL and opens the content in a new window.
 *
 * @param data
 * @param type
 * @param encoding
 */
const openFile = (data, type, encoding = DEFAULT_FILE_ENCODING) => {
  const url = createUrl(data, type, encoding);
  window.open(url, '_blank');
};

/**
 * Converts the passed data to JSON and downloads it as a file from the browser.
 *
 * @param data
 * @param name
 */
const downloadJSON = (data, name) => downloadFile(JSON.stringify(data), name, FILE_TYPE_JSON);

/**
 * Opens the passed text data in a new window.
 *
 * @param data
 */
const openText = (data) => openFile(data, FILE_TYPE_TEXT);

export default {
  downloadJSON,
  openText
};
