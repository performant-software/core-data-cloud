// @flow

const DEFAULT_FILE_ENCODING = 'UTF-8';
const FILE_TYPE_JSON = 'application/json';

/**
 * Helper function to convert the passed data to a URL and download it as a file.
 *
 * @param data
 * @param name
 * @param type
 * @param encoding
 */
const downloadFile = (data, name, type, encoding = DEFAULT_FILE_ENCODING) => {
  const blob = new Blob([data], { type, encoding });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

/**
 * Converts the passed data to JSON and downloads it as a file from the browser.
 *
 * @param data
 * @param name
 */
const downloadJSON = (data, name) => downloadFile(JSON.stringify(data), name, FILE_TYPE_JSON);

export default {
  downloadJSON
};
