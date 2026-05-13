// @flow

import React, { useMemo } from 'react';
import { Link } from 'react-router';
import { Button, Popup } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

type Props = {
  item: { id: string }
}

export const EditButton = ({ item }: Props) => {
  const { t } = useTranslation();

  const TriggerButton = useMemo(() => (
    <Button
      basic
      compact
      icon='pencil'
    />
  ), [])

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
        trigger={TriggerButton}
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
