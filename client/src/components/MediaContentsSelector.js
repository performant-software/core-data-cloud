// @flow

import {
  ItemCollection,
  ItemList,
  ItemViews,
  LazyImage
} from '@performant-software/semantic-components';
import { UserDefinedFieldsForm, UserDefinedFieldsService } from '@performant-software/user-defined-fields';
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
  Form,
  Grid,
  Label,
  Message,
  Modal
} from 'semantic-ui-react';
import _ from 'underscore';
import type { MediaContent as MediaContentType } from '../types/MediaContent';
import styles from './MediaContentsSelector.module.css';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';
import useSelectable from '../hooks/Selectable';
import UserDefinedFieldsUtils from '../utils/UserDefinedFields';

const FIELD_SEPARATOR = ', ';

type ItemType = {
  mediaContent: MediaContentType,
  userDefined: {
    [key: string] : string
  },
  errors: Array<string>
};

type Props = {
  onClose: () => void,
  onLoad: (params: any) => Promise<any>,
  onSave: (items: Array<ItemType>) => void
};

const MediaContentsSelector = (props: Props) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [userDefinedFields, setUserDefinedFields] = useState([]);

  const { projectModelRelationship } = useProjectModelRelationship();
  const { isSelected, onRowSelect } = useSelectable();
  const { t } = useTranslation();

  /**
   * Extracts the validation errors from the list of selected items.
   */
  const errors = useMemo(() => _.filter(selectedItems, (item) => !_.isEmpty(item.errors)), [selectedItems]);

  /**
   * Returns `true` if an error exists for the passed item/key.
   *
   * @type {function(*, *): *}
   */
  const isError = useCallback((item, key) => _.contains(item.errors, UserDefinedFieldsUtils.parseUuid(key)), []);

  /**
   * Updates the `user_defined` value for the passed item in the state.
   *
   * @type {function(*, *): void}
   */
  const onChange = useCallback((item, userDefined) => (
    setSelectedItems((prevItems) => _.map(prevItems, (i) => (
      i.mediaContent.id === item.id ? { mediaContent: i.mediaContent, userDefined } : i
    )))
  ), []);

  /**
   * Toggles selection of the passed media_content record.
   *
   * @type {(function(*): void)|*}
   */
  const onItemSelection = useCallback((mediaContent) => {
    if (isSelected(mediaContent)) {
      setSelectedItems((prevItems) => _.filter(prevItems, (i) => i.mediaContent.id !== mediaContent.id));
    } else {
      setSelectedItems((prevItems) => [...prevItems, { mediaContent }]);
    }

    onRowSelect(mediaContent);
  }, [isSelected, onRowSelect]);

  /**
   * Validates required fields for the passed item.
   *
   * @type {function(*): *&{errors: []}}
   */
  const validateItem = useCallback((item) => {
    const itemErrors = [];

    _.each(userDefinedFields, (field) => {
      const value = item.userDefined && item.userDefined[field.uuid];

      if (_.isEmpty(value)) {
        itemErrors.push(field.uuid);
      }
    });

    return {
      ...item,
      errors: itemErrors
    };
  }, [userDefinedFields]);

  /**
   * Returns a Promise to evaluate required fields for all of the selected items.
   *
   * @type {function(): Promise<unknown>}
   */
  const onValidate = useCallback(() => new Promise((resolve, reject) => {
    let error = false;

    // Validate each item
    const newItems = _.map(selectedItems, (item) => {
      const newItem = validateItem(item);

      if (!_.isEmpty(newItem.errors)) {
        error = true;
      }

      return newItem;
    });

    // Set the new items on the state
    setSelectedItems(newItems);

    // Reject or resolve the promise
    if (error) {
      reject(new Error());
    } else {
      resolve();
    }
  }), [selectedItems, validateItem]);

  /**
   * Validates required fields for the selected records and calls the `onSave` prop.
   *
   * @type {(function(): void)|*}
   */
  const onSave = useCallback(() => {
    setUploading(true);

    onValidate()
      .then(() => props.onSave(selectedItems))
      .catch(() => setUploading(false))
      .finally(() => setUploading(false));
  }, [onValidate, selectedItems, props.onSave]);

  /**
   * Renders the error message for the passed item.
   *
   * @type {function(*): *}
   */
  const renderError = useCallback((item) => {
    const { mediaContent: { name }, errors: itemErrors } = item;

    const fieldNames = (uuid) => _.findWhere(userDefinedFields, { uuid })?.column_name;
    const fields = _.map(itemErrors, fieldNames).join(FIELD_SEPARATOR);

    return t('MediaContentsSelector.errors.required', { name, fields });
  }, [userDefinedFields]);

  /**
   * Loads the list of required user-defined fields when the component is mounted.
   */
  useEffect(() => {
    UserDefinedFieldsService
      .fetchAll({
        defineable_id: projectModelRelationship.id,
        defineable_type: 'CoreDataConnector::ProjectModelRelationship',
        required: true
      })
      .then(({ data }) => setUserDefinedFields(data.user_defined_fields));
  }, [projectModelRelationship.id]);

  return (
    <Modal
      centered={false}
      className={cx('media-contents-selector', styles.mediaContentsSelector)}
      open
    >
      <Modal.Header
        content={t('MediaContentsSelector.title')}
      />
      <Modal.Content>
        { !_.isEmpty(errors) && (
          <Message
            error
          >
            <Message.Header
              content={t('MediaContentsSelector.errors.header')}
            />
            <Message.List
              items={_.map(errors, renderError)}
            />
          </Message>
        )}
        <Grid
          className={styles.grid}
          columns={2}
          divided
          padded
        >
          <Grid.Column
            className={styles.column}
          >
            <ItemList
              as={Button}
              asProps={(item) => ({
                onClick: () => onItemSelection(item)
              })}
              className={styles.itemList}
              collectionName='media_contents'
              hideToggle
              itemsPerRow={2}
              defaultView={ItemViews.grid}
              link
              onLoad={props.onLoad}
              renderImage={(item) => (
                <LazyImage
                  dimmable={false}
                  preview={item.content_thumbnail_url}
                  size='small'
                  src={item.content_iiif_url}
                />
              )}
              renderMeta={(item) => (
                <div
                  className={styles.truncateName}
                >
                  { item.name }
                  { isSelected(item) && (
                    <Label
                      color='green'
                      corner
                      icon='checkmark'
                    />
                  )}
                </div>
              )}
            />
          </Grid.Column>
          <Grid.Column
            className={styles.column}
          >
            <ItemCollection
              defaultView={ItemViews.list}
              hideToggle
              items={selectedItems}
              renderDescription={(item) => (
                <Form>
                  { projectModelRelationship && (
                    <UserDefinedFieldsForm
                      data={item.userDefined}
                      defineableId={projectModelRelationship.id}
                      defineableType='CoreDataConnector::ProjectModelRelationship'
                      fields={userDefinedFields}
                      isError={(key) => isError(item, key)}
                      onChange={(data) => onChange(item.mediaContent, data)}
                      onClearValidationError={() => {}}
                      required
                      tableName='CoreDataConnector::Relationship'
                    />
                  )}
                  <Button
                    basic
                    className='borderless'
                    color='red'
                    floated='right'
                    icon='times'
                    onClick={() => onItemSelection(item.mediaContent)}
                    type='button'
                  />
                </Form>
              )}
              renderEmptyList={() => null}
              renderHeader={(item) => item.mediaContent.name}
              renderImage={(item) => (
                <LazyImage
                  dimmable={false}
                  preview={item.mediaContent.content_thumbnail_url}
                  size='tiny'
                />
              )}
            />
          </Grid.Column>
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content={t('Common.buttons.save')}
          loading={uploading}
          onClick={onSave}
          primary
        />
        <Button
          content={t('Common.buttons.cancel')}
          onClick={props.onClose}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default MediaContentsSelector;
