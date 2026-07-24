// @flow

import React, { useMemo } from 'react';
import { Link } from 'react-router';
import { Button, Popup } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

type Props = {
  item: { id: string },
  resolveUrl?: (item: any) => string
}

export const EditButton = (props: Props) => {
  const { t } = useTranslation();

  const url = props.resolveUrl
    ? props.resolveUrl(props.item)
    : `${props.item.id}`;

  const TriggerButton = useMemo(() => (
    <Button
      as={Link}
      basic
      compact
      icon='pencil'
      to={url}
    />
  ), [])

  return (
    <Popup
      content={t('Common.actions.navigate.content')}
      header={t('Common.actions.navigate.title')}
      hideOnScroll
      mouseEnterDelay={500}
      position='top right'
      trigger={TriggerButton}
    />
  )
}

type GetEditButtonOptions = {
  resolveUrl: (item: any) => string,
  idField?: string
}

export const getEditButton = (item: any, options?: GetEditButtonOptions) => {
  const identiferField = options?.idField || 'id';

  return (
    <EditButton
      key={`edit-${item[identiferField]}`}
      item={item}
      resolveUrl={options?.resolveUrl}
    />
  );
};
