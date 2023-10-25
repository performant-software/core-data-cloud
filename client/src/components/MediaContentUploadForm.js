// @flow

import { LazyMedia } from '@performant-software/semantic-components';
import type { FileUploadProps } from '@performant-software/semantic-components/types';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React from 'react';
import { Button, Form, Item } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

type Props = EditContainerProps & FileUploadProps;

const MediaContentUploadForm = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Item
      className='file-upload'
    >
      <Item.Image>
        <LazyMedia
          contentType={props.item.content_type}
          dimmable={false}
          src={props.item.content_url}
        />
      </Item.Image>
      <Item.Content>
        <Form.Input
          error={props.isError('name')}
          label={t('MediaContentUploadForm.labels.name')}
          onChange={props.onTextInputChange.bind(this, 'name')}
          required={props.isRequired('name')}
          value={props.item.name}
        />
        <Button
          basic
          color='red'
          icon='trash'
          onClick={props.onDelete}
        />
        { props.renderStatus() }
      </Item.Content>
    </Item>
  );
};

export default MediaContentUploadForm;
