// @flow

import { EmbeddedList } from '@performant-software/semantic-components';
import { ObjectJs as ObjectUtils } from '@performant-software/shared-components';
import cx from 'classnames';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Checkbox,
  Confirm,
  Dimmer,
  Dropdown,
  Header,
  Label,
  Loader,
  Message,
  Modal
} from 'semantic-ui-react';
import _ from 'underscore';
import ImportCompareModal from './ImportCompareModal';
import ImportStatus from './ImportStatus';
import ItemsService from '../services/Items';
import { DefaultSort, Status } from '../constants/Import';
import styles from './ImportModal.module.css';

type Props = {
  id: number,
  onClose: () => void,
  onSave: () => void,
  title: string
};

const FILE_NAME_RELATIONSHIPS = 'relationships.csv';
const MAX_DEFAULT_COLUMNS = 3;

const ImportModal = (props: Props) => {
  const [confirmation, setConfirmation] = useState(false);
  const [data, setData] = useState();
  const [errors, setErrors] = useState([]);
  const [fileName, setFileName] = useState();
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const { t } = useTranslation();

  /**
   * Memo-izes the table display columns.
   *
   * @type {[]}
   */
  const columns = useMemo(() => {
    const value = [];

    const { attributes } = _.get(data, fileName) || {};

    _.each(attributes, (attribute, index) => {
      if (attribute.name !== 'project_model_id' && attribute.name !== 'project_model_relationship_id') {
        value.push({
          ...attribute,
          editable: attribute.name !== 'uuid',
          hidden: index > MAX_DEFAULT_COLUMNS,
        });
      }
    });

    // Add the "Status" column
    value.push({
      name: 'status',
      label: t('ImportModal.labels.status'),
      render: (item) => (
        <ImportStatus
          status={item.status}
        />
      )
    });

    return value;
  }, [data, fileName]);

  /**
   * Returns the count of records with the (optional) passed statuses.
   *
   * @type {function([]=): number}
   */
  const getCount = useCallback((status = null) => {
    let count = 0;

    _.each(_.keys(data), (file) => {
      if (file !== FILE_NAME_RELATIONSHIPS) {
        _.each(data[file].data, (row) => {
          if (_.isEmpty(status) || status === row.status) {
            count += 1;
          }
        });
      }
    });

    return count;
  }, [data]);

  /**
   * Sets the total number of records with conflicts.
   *
   * @type {number}
   */
  const countConflicts = useMemo(() => getCount(Status.conflict), [getCount]);

  /**
   * Sets the total number of new records.
   *
   * @type {number}
   */
  const countNew = useMemo(() => getCount(Status.new), [getCount]);

  /**
   * Sets the total number of records without conflicts.
   *
   * @type {number}
   */
  const countNoConflicts = useMemo(() => getCount(Status.noConflict), [getCount]);

  /**
   * Sets the total number of records that have been resolved.
   *
   * @type {number}
   */
  const countResolved = useMemo(() => getCount(Status.resolved), [getCount]);

  /**
   * Sets the total number of records.
   *
   * @type {number}
   */
  const countTotal = useMemo(() => getCount(), [getCount]);

  /**
   * Returns the import status for the passed item.
   *
   * @type {(function(*): (*))|*}
   */
  const getStatus = useCallback((item) => {
    if (item.status) {
      return item.status;
    }

    if (_.isEmpty(item.db)) {
      return Status.new;
    }

    let status;

    const { db = {}, duplicates = [], import: incoming } = ObjectUtils.without(item, 'uuid');
    const isEqual = _.every([db, ...duplicates], (i) => ObjectUtils.isEqual(incoming, i, { removeEmptyValues: true }));

    if (isEqual) {
      status = Status.noConflict;
    } else {
      status = Status.conflict;
    }

    return status;
  }, []);

  /**
   * Memo-izes the display items for the current file name.
   */
  const items = useMemo(() => {
    const { data: value } = _.get(data, fileName) || {};
    return value;
  }, [data, fileName]);

  /**
   * Memoizes the list of items to display on the import table.
   */
  const importItems = _.map(items, (item, index) => ({
    ...item.import,
    index,
    status: item.status
  }));

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
    setConfirmation(false);

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
  const onRemove = useCallback((item) => {
    const newData = { ...data };

    _.extend(newData[fileName], { data: _.filter(newData[fileName].data, (i, index) => index !== item.index) });

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

    /**
     * If the item currently has a status of "conflict", assume that the user has resolved any conflicts and
     * mark as resolved.
     */
    let { status } = newItem;

    if (status === Status.conflict) {
      status = Status.resolved;
    }

    _.extend(newItem, { import: item, status });

    setData(newData);
    setSelectedIndex(null);
  }, [data, fileName, selectedIndex]);

  /**
   * Toggles the "remove duplicates" value for the current file.
   *
   * @type {(function(*, {checked: *}): void)|*}
   */
  const onToggleRemoveDuplicates = useCallback((e, { checked }) => {
    const newData = { ...data };

    _.extend(newData[fileName], { remove_duplicates: checked });

    setData(newData);
  }, [data, fileName]);

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
  ), [getStatus]);

  /**
   * Calls the `/items/:id/analyze_import` API endpoint and sets the results on the state.
   */
  useEffect(() => {
    ItemsService
      .analyzeImport(props.id)
      .then(analyzeData)
      .then(() => setLoaded(true))
      .catch(onError);
  }, [props.id]);

  /**
   * Sets the file name on the state to the first file in the dataset if no file is set.
   */
  useEffect(() => {
    if (!fileName) {
      setFileName(_.first(_.keys(data)));
    }
  }, [data, fileName]);

  return (
    <Modal
      centered={false}
      className={cx(styles.importModal, 'import-modal')}
      open
    >
      <Modal.Header>
        <Header
          content={props.title}
          icon='cloud download'
        />
        <Label.Group>
          <ImportStatus
            count={countNew}
            status={Status.new}
          />
          <ImportStatus
            count={countConflicts}
            status={Status.conflict}
          />
          <ImportStatus
            count={countResolved}
            status={Status.resolved}
          />
          <ImportStatus
            count={countNoConflicts}
            status={Status.noConflict}
          />
          <Label
            color='black'
            content={t('ImportModal.labels.total')}
            icon='database'
            detail={countTotal}
          />
        </Label.Group>
      </Modal.Header>
      <Modal.Content
        className={styles.content}
        scrolling
      >
        { !_.isEmpty(errors) && (
          <Message
            header={t('ImportModal.errors.header')}
            list={_.map(errors, (e) => (_.isObject(e) ? _.values(e) : e))}
            negative
          />
        )}
        { !loaded && _.isEmpty(errors) && (
          <Dimmer
            active
            inverted
          >
            <Loader />
          </Dimmer>
        )}
        { loaded && _.isEmpty(data) && (
          <Message
            content={t('ImportModal.messages.notFound.content', { name: props.title })}
            header={t('ImportModal.messages.notFound.header')}
            icon='question mark'
          />
        )}
        { loaded && !_.isEmpty(data) && fileName && (
          <EmbeddedList
            actions={[{
              name: 'edit',
              icon: 'pencil',
              onClick: (item) => setSelectedIndex(item.index)
            }, {
              name: 'delete',
              icon: 'times',
              onClick: (item) => onRemove(item)
            }]}
            buttons={[{
              render: () => (
                <Dropdown
                  selection
                  onChange={(e, { value }) => setFileName(value)}
                  options={options}
                  value={fileName}
                />
              )
            }, {
              render: () => (
                <Checkbox
                  className={styles.duplicatesCheckbox}
                  checked={data[fileName]?.remove_duplicates}
                  label={t('ImportModal.labels.removeDuplicates')}
                  onChange={onToggleRemoveDuplicates}
                  toggle
                />
              )
            }]}
            columns={columns}
            defaultSort={DefaultSort[fileName]}
            items={importItems}
            key={fileName}
            tableProps={{
              celled: false,
              padded: true,
              size: 'small'
            }}
          />
        )}
        { selectedIndex != null && items[selectedIndex] && (
          <ImportCompareModal
            attributes={_.filter(columns, (column) => column.name !== 'status')}
            item={items[selectedIndex]}
            onClose={() => setSelectedIndex(null)}
            onSave={onSave}
          />
        )}
        { confirmation && (
          <Confirm
            centered={false}
            content={t('ImportModal.confirmation.content', { countTotal, countConflicts })}
            header={(
              <Header
                content={t('ImportModal.confirmation.header')}
                icon='warning sign'
              />
            )}
            onCancel={() => setConfirmation(false)}
            onConfirm={onImport}
            open
          />
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button
          content={t('Common.buttons.cancel')}
          onClick={props.onClose}
        />
        <Button
          content={t('ImportModal.buttons.import')}
          disabled={loading || !_.isEmpty(errors) || _.isEmpty(data)}
          loading={loading}
          onClick={() => setConfirmation(true)}
          primary
        />
      </Modal.Actions>
    </Modal>
  );
};

export default ImportModal;
