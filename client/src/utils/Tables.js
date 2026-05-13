// @flow

import React from 'react';
import { Link } from 'react-router';
import { Button, Popup } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

type Props = {
  item: { id: string }
}

export const EditButton = ({ item }: Props) => {
  const { t } = useTranslation();

  return (
    <Link

      to={`${item.id}`}
    >
      <Popup
        content={t('Common.actions.navigate.content')}
        header={t('Common.actions.navigate.title')}
        hideOnScroll
        mouseEnterDelay={500}
        position='top right'
        trigger={<Button
          basic
          compact
          icon='edit outline'
        />}
      />

    </Link>
  )
}

export const getEditButton = (item: any) => (
  <EditButton
    key={`edit-${item.id}`}
    item={item}
  />
);
