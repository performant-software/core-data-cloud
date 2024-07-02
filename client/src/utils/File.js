// @flow

const DEFAULT_FILE_ENCODING = 'UTF-8';

const FILE_TYPE_JSON = 'application/json';
const FILE_TYPE_TEXT = 'text/plain';
const FILE_TYPE_ZIP = 'application/zip';

const FileExtensions = {
  [FILE_TYPE_JSON]: 'json',
  [FILE_TYPE_ZIP]: 'zip'
};

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
  const filename = getFilename(name, FileExtensions[type]);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  const clickHandler = () => setTimeout(() => URL.revokeObjectURL(url), 150);
  link.addEventListener('click', clickHandler, false);

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
 * Downloads the passed binary data as a zip file.
 *
 * @param data
 * @param name
 */
const downloadZip = (data, name) => downloadFile(data, name, FILE_TYPE_ZIP);

/**
 * Removes the whitespace from the passed name and appends the passed extension to create a filename.
 *
 * @param name
 * @param extension
 *
 * @returns {`${string}.${string}`}
 */
const getFilename = (name, extension) => {
  const filename = [name];

  if (!name.includes(`.${extension}`)) {
    filename.push('.');
    filename.push(extension);
  }

  return filename.join('');
};

/**
 * Opens the passed text data in a new window.
 *
 * @param data
 */
const openText = (data) => openFile(data, FILE_TYPE_TEXT);

export default {
  downloadJSON,
  downloadZip,
  openText
};
