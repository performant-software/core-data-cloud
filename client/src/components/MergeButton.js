// @flow

import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaArrowRightArrowLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { Button, Confirm, Icon } from 'semantic-ui-react';
import _ from 'underscore';
import MergeModal, { type MergeAttributeType } from './MergeModal';

type Props = {
  attributes: Array<MergeAttributeType>,
  ids: Array<number>,
  onLoad: (id: number) => Promise<any>,
  onSave: (item: any) => Promise<any>,
  projectModelId: number,
  title: string
};

const MergeButton = (props: Props) => {
  const [errors, setErrors] = useState();
  const [item, setItem] = useState();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  /**
   * Sets the button content based on the number of IDs provided.
   *
   * @type {string}
   */
  const buttonContent = useMemo(() => (_.size(props.ids) > 1
    ? t('MergeButton.buttons.mergeCount', { count: props.ids.length })
    : t('MergeButton.buttons.merge')
  ), [props.ids]);

  /**
   * Sets the disabled state based on the number of IDs provided.
   *
   * @type {boolean}
   */
  const disabled = useMemo(() => _.size(props.ids) <= 1, [props.ids]);

  /**
   * Resets the state and navigates to the newly created record.
   *
   * @type {(function({id: *}): void)|*}
   */
  const afterMerge = useCallback(({ id }) => {
    setSaving(false);
    setItem(null);
    setOpen(false);
    navigate(`${id}`, { state: { saved: true } });
  }, []);

  /**
   * Resets the state and closes the modal.
   *
   * @type {(function(): void)|*}
   */
  const onClose = useCallback(() => {
    setItem(null);
    setOpen(false);
    setErrors(null);
    setSaving(false);
  }, []);

  /**
   * Sets the passed errors on the state.
   *
   * @type {(function({response: {data: {errors: *}}}): void)|*}
   */
  const onError = useCallback(({ response: { data: { errors: mergeErrors } } }) => {
    const value = [];

    _.each(_.keys(mergeErrors), (key) => {
      if (key.includes('user_defined')) {
        const [, message] = _.first(mergeErrors[key]);
        value.push(message);
      } else {
        value.push(mergeErrors[key]);
      }
    });

    setErrors(value);
    setSaving(false);
    setItem(null);
  }, []);

  /**
   * Calls the `onSave` callback.
   *
   * @type {function(*): void}
   */
  const onMerge = useCallback(() => {
    if (!item) {
      return;
    }

    setSaving(true);

    props
      .onSave(item)
      .then(afterMerge)
      .catch(onError);
  }, [afterMerge, item, props.onSave]);

  return (
    <>
      <Button
        content={buttonContent}
        disabled={disabled}
        icon={(
          <Icon>
            <FaArrowRightArrowLeft />
          </Icon>
        )}
        onClick={() => setOpen(true)}
      />
      { open && (
        <MergeModal
          attributes={props.attributes}
          errors={errors}
          ids={props.ids}
          onClose={onClose}
          onLoad={props.onLoad}
          onSave={setItem}
          projectModelId={props.projectModelId}
          saving={saving}
          title={props.title}
        />
      )}
      { item && !saving && (
        <Confirm
          centered={false}
          content={t('MergeButton.messages.confirm.content')}
          header={t('MergeButton.messages.confirm.header')}
          open
          onCancel={() => setItem(null)}
          onConfirm={onMerge}
        />
      )}
    </>
  );
};

export default MergeButton;
