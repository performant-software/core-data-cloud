// @flow

import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaArrowRightArrowLeft } from 'react-icons/fa6';
import {
  Button,
  Confirm,
  Icon,
} from 'semantic-ui-react';
import _ from 'underscore';
import MergeModal, { type MergeAttributeType } from './MergeModal';

type Props = {
  attributes: Array<MergeAttributeType>,
  ids: Array<number>,
  onLoad: (id: number) => Promise<any>,
  projectModelId: number,
  title: string
};

const MergeButton = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState(false);

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
   * TODO: Implement me
   *
   * @type {function(*): void}
   */
  const onMerge = useCallback((item) => console.log(item), []);

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
          ids={props.ids}
          onClose={() => setOpen(false)}
          onLoad={props.onLoad}
          onSave={() => setConfirmation(true)}
          projectModelId={props.projectModelId}
          title={props.title}
        />
      )}
      { confirmation && (
        <Confirm
          centered={false}
          open
          onCancel={() => setConfirmation(false)}
          onConfirm={onMerge}
        />
      )}
    </>
  );
};

export default MergeButton;
