// @flow

import { LazyIIIF, SimpleEditPage } from '@performant-software/semantic-components';
import { IIIF as IIIFUtils } from '@performant-software/shared-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button, Header } from 'semantic-ui-react';
import type { Relationship as RelationshipType } from '../types/Relationship';
import styles from './RelatedMediaContent.module.css';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';
import { useRelationship, withRelationshipEditPage } from '../hooks/Relationship';
import { useTranslation } from 'react-i18next';

type Props = EditContainerProps & {
  item: RelationshipType
};

const RelatedMediaContentForm = (props: Props) => {
  const { relatedClassUrl } = useProjectModelRelationship();
  const { onNewRecord } = useRelationship(props);
  const { t } = useTranslation();

  /**
   * Sets the manifest URL.
   *
   * @type {string|string|*}
   */
  const manifest = useMemo(() => (
    IIIFUtils.createManifestURL(props.item?.related_record?.manifest)
  ), [props.item?.related_record?.manifest]);

  /**
   * For a new record, set the foreign keys.
   */
  useEffect(() => onNewRecord(), [onNewRecord]);

  return (
    <SimpleEditPage
      {...props}
      className={styles.relatedMediaContent}
    >
      <SimpleEditPage.Tab
        key='default'
      >
        <div
          className={styles.imageContainer}
        >
          <LazyIIIF
            color='teal'
            contentType={props.item?.related_record?.content_type}
            downloadUrl={props.item?.related_record?.content_download_url}
            manifest={manifest}
            preview={props.item.related_record?.content_preview_url}
            src={props.item?.related_record?.content_url}
          >
            <Button
              as={Link}
              color='orange'
              content={t('Common.buttons.edit')}
              icon='edit'
              to={`${relatedClassUrl}/${props.item?.related_record?.id}`}
            />
          </LazyIIIF>
          <Header
            className={styles.header}
            content={props.item?.related_record?.name}
          />
        </div>
      </SimpleEditPage.Tab>
    </SimpleEditPage>
  );
};

const RelatedMediaContent = withRelationshipEditPage(RelatedMediaContentForm);
export default RelatedMediaContent;
