// @flow

import { ObjectJs as ObjectUtils } from '@performant-software/shared-components';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Dropdown,
  Header,
  Message,
  Modal,
  Table
} from 'semantic-ui-react';
import _ from 'underscore';
import ImportCompareModal from './ImportCompareModal';
import ImportStatus from './ImportStatus';
import ItemsService from '../services/Items';
import { Status } from '../constants/Import';

type Props = {
  id: number,
  onClose: () => void,
  onSave: () => void,
  title: string
};

const FILE_NAME_RELATIONSHIPS = 'relationships.csv';

const ImportModal = (props: Props) => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState();
  const [errors, setErrors] = useState([]);
  const [fileName, setFileName] = useState();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const { t } = useTranslation();

  /**
   * Removes the "project_model_id" and "project_model_relationship_id" attributes from the list of visible attributes.
   *
   * @type {unknown}
   */
  const displayAttributes = useCallback((column) => (
    column.name !== 'project_model_id' && column.name !== 'project_model_relationship_id'
  ), []);

  /**
   * Returns the import status for the passed item.
   *
   * @type {(function(*): (*))|*}
   */
  const getStatus = useCallback((item) => {
    let status;

    if (item.status) {
      return item.status;
    }

    if (_.isEmpty(item.db)) {
      status = Status.new;
    } else if (ObjectUtils.isEqual(item.db, item.import)) {
      status = Status.noConflict;
    } else {
      status = Status.conflict;
    }

    return status;
  }, []);

  /**
   * Sets the file name dropdown options.
   *
   * @type {[]}
   */
  const options = useMemo(() => {
    const fileNames = [];

    _.each(_.keys(data), (name) => {
      if (name !== FILE_NAME_RELATIONSHIPS) {
        fileNames.push({
          key: name,
          value: name,
          text: name
        });
      }
    });

    return fileNames;
  }, [data]);

  /**
   * Sets the errors on the state.
   *
   * @type {function({response: {data: {errors: *}}}): void}
   */
  const onError = useCallback(({ response: { data: { errors: e } } }) => setErrors(e), []);

  /**
   * Calls the /core_data/items/:id/import API endpoint with the current data set.
   *
   * @type {(function(): void)|*}
   */
  const onImport = useCallback(() => {
    setLoading(true);

    ItemsService
      .import(props.id, data)
      .then(props.onSave)
      .catch(onError)
      .finally(() => setLoading(false));
  }, [data, props.id, props.onSave]);

  /**
   * Removes the item at the passed index from the data set.
   *
   * @type {(function(*): void)|*}
   */
  const onRemove = useCallback((index) => {
    const newData = { ...data };

    _.extend(newData[fileName], { data: _.filter(newData[fileName].data, (i, idx) => idx !== index) });
    setData(newData);
  }, [data, fileName]);

  /**
   * Updates the passed item in the data set.
   *
   * @type {(function(*): void)|*}
   */
  const onSave = useCallback((item) => {
    const newData = { ...data };
    const newItem = newData[fileName].data[selectedIndex];

    // TODO: Comment me
    let { status } = newItem;

    if (status === Status.conflict) {
      status = Status.resolved;
    }

    _.extend(newItem, { import: item, status });

    setData(newData);
    setSelectedIndex(null);
  }, [data, fileName, selectedIndex]);

  /**
   * Sets the calculated import status on each row of the data set.
   *
   * @type {function(*): void}
   */
  const analyzeData = useCallback((response) => setData(
    _.mapObject(
      response.data,
      ({ attributes, data: rows }) => ({ attributes, data: _.map(rows, (row) => ({ ...row, status: getStatus(row) })) })
    )
  ), []);

  /**
   * Calls the `/items/:id/analyze_import` API endpoint and sets the results on the state.
   */
  useEffect(() => {
    ItemsService
      .analyzeImport(props.id)
      .then(analyzeData);
  }, [props.id]);

  /**
   * Sets the file name on the state to the first file in the dataset if no file is set.
   */
  useEffect(() => {
    if (!fileName) {
      setFileName(_.first(_.keys(data)));
    }
  }, [data, fileName]);

  /**
   * Sets the display columns and items on the state based on the selected file.
   */
  useEffect(() => {
    if (data && fileName) {
      const { attributes, data: fileItems } = data[fileName] || {};

      setColumns(_.filter(attributes, displayAttributes));
      setItems(fileItems);
    }
  }, [data, displayAttributes, fileName]);

  return (
    <Modal
      centered={false}
      open
    >
      <Modal.Header>
        <Header
          content={props.title}
          icon='cloud download'
        />
      </Modal.Header>
      <Modal.Content
        scrolling
        style={{
          minHeight: '50vh'
        }}
      >
        { !_.isEmpty(errors) && (
          <Message
            header={t('ImportModal.errors.header')}
            list={_.map(errors, (e) => _.values(e))}
            negative
          />
        )}
        <Dropdown
          selection
          onChange={(e, { value }) => setFileName(value)}
          options={options}
          value={fileName}
        />
        <Table
          padded
          size='small'
        >
          <Table.Header>
            <Table.Row>
              { columns && _.map(columns, (column) => (
                <Table.HeaderCell
                  content={column.label}
                  style={{
                    textWrap: 'nowrap'
                  }}
                />
              ))}
              <Table.HeaderCell />
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { items && _.map(items, (item, index) => (
              <Table.Row>
                { columns && _.map(columns, (column) => (
                  <Table.Cell>
                    { item.import[column.name] }
                  </Table.Cell>
                ))}
                <Table.Cell>
                  <ImportStatus
                    status={item.status}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Button.Group>
                    { item.import && item.db && (
                      <Button
                        basic
                        compact
                        icon='pencil'
                        onClick={() => setSelectedIndex(index)}
                      />
                    )}
                    <Button
                      basic
                      compact
                      icon='times'
                      onClick={() => onRemove(index)}
                    />
                  </Button.Group>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        { selectedIndex != null && items[selectedIndex] && (
          <ImportCompareModal
            attributes={columns}
            item={items[selectedIndex]}
            onClose={() => setSelectedIndex(null)}
            onSave={onSave}
          />
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button
          content={t('Common.buttons.cancel')}
          onClick={props.onClose}
        />
        <Button
          content={'Import'}
          disabled={loading}
          loading={loading}
          onClick={onImport}
          primary
        />
      </Modal.Actions>
    </Modal>
  );
};

export default ImportModal;
