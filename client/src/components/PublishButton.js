// @flow

import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'semantic-ui-react';

type Props = {
  onPublish: (published: boolean) => Promise<any>,
  published: boolean
};

const COLOR_GREEN = 'green';
const COLOR_GREY = 'grey';

const ICON_PRIVATE = 'eye slash';
const ICON_PUBLIC = 'eye';

const PublishButton = (props: Props) => {
  const [publishing, setPublishing] = useState(false);

  const { t } = useTranslation();

  const color = useMemo(() => (props.published ? COLOR_GREEN : COLOR_GREY), [props.published]);

  const content = useMemo(() => (
    props.published ? t('PublishButton.buttons.public') : t('PublishButton.buttons.private')
  ), [props.published]);

  const icon = useMemo(() => (props.published ? ICON_PUBLIC : ICON_PRIVATE), [props.published]);

  const onClick = useCallback(() => {
    setPublishing(true);

    props
      .onPublish(!props.published)
      .finally(() => setPublishing(false));
  }, [props.onPublish, props.published]);

  return (
    <Button
      color={color}
      content={content}
      disabled={publishing}
      icon={icon}
      loading={publishing}
      onClick={onClick}
    />
  );
};

export default PublishButton;
