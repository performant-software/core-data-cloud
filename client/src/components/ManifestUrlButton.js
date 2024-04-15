// @flow

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'semantic-ui-react';
import _ from 'underscore';

type Props = {
  delay?: number,
  url: string
};

const COLOR_DARK_GRAY = 'dark gray';
const COLOR_GREEN = 'green';

const ManifestUrlButton = (props: Props) => {
  const [active, setActive] = useState(false);

  const { t } = useTranslation();

  /**
   * Memo-izes the button color based on the active state.
   *
   * @type {string}
   */
  const color = useMemo(() => (
    active ? COLOR_GREEN : COLOR_DARK_GRAY
  ), [active]);

  /**
   * Memo-izes the button content based on the active state.
   *
   * @type {string}
   */
  const content = useMemo(() => (
    active ? t('ManifestUrlButton.buttons.copied') : t('ManifestUrlButton.buttons.url')
  ), [active]);

  /**
   * Copies the URL to the clipboard and sets the active indicator on the state.
   *
   * @type {(function(): void)|*}
   */
  const onClick = useCallback(() => {
    navigator
      .clipboard
      .writeText(props.url)
      .then(() => setActive(true));
  }, [props.url]);

  /**
   * Sets the active indicator on the state to false after a delay.
   */
  useEffect(() => {
    if (active) {
      _.delay(() => setActive(false), props.delay);
    }
  }, [active]);

  return (
    <Button
      color={color}
      content={content}
      icon='copy outline'
      onClick={onClick}
    />
  );
};

ManifestUrlButton.defaultProps = {
  delay: 3000
};

export default ManifestUrlButton;
