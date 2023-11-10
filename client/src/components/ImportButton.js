// @flow

import { FileInputButton } from '@performant-software/semantic-components';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaFileImport } from 'react-icons/fa';
import { Button, Icon, Modal } from 'semantic-ui-react';

type Props = {
  onImport: (file: File) => Promise<any>
};

const ImportButton = (props: Props) => {
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  /**
   * Sets the loading indicator then calls the "onImport" prop.
   *
   * @type {(function(): void)|*}
   */
  const onConfirm = useCallback(() => {
    setLoading(true);

    props
      .onImport(file)
      .then(() => setFile(null))
      .finally(() => setLoading(false));
  }, [file, props.onImport]);

  /**
   * Sets the file on the state.
   *
   * @type {function([*]): void}
   */
  const onSelection = useCallback(([f]) => setFile(f), []);

  return (
    <>
      <FileInputButton
        color='green'
        content={t('ImportButton.buttons.import')}
        icon={(
          <Icon>
            <FaFileImport />
          </Icon>
        )}
        onSelection={onSelection}
      />
      { file && (
        <Modal
          centered={false}
          open
        >
          <Modal.Header
            content={t('ImportButton.header')}
          />
          <Modal.Content
            content={t('ImportButton.content')}
          />
          <Modal.Actions>
            <Button
              content={t('Common.buttons.cancel')}
              disabled={loading}
              onClick={() => setFile(null)}
            />
            <Button
              content={t('ImportButton.buttons.confirm')}
              disabled={loading}
              loading={loading}
              primary
              onClick={onConfirm}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
};

export default ImportButton;
