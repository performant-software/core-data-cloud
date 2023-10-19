// @flow

import { LazyIIIF, SimpleEditPage } from '@performant-software/semantic-components';
import { IIIF as IIIFUtils } from '@performant-software/shared-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button, Header } from 'semantic-ui-react';
import type { Relationship as RelationshipType } from '../types/Relationship';
import styles from './RelatedMediaContent.module.css';
import useParams from '../hooks/ParsedParams';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';
import { useRelationship, withRelationshipEditPage } from '../hooks/Relationship';

type Props = EditContainerProps & {
  item: RelationshipType
};

const RelatedMediaContentForm = (props: Props) => {
  const { projectModelRelationshipId } = useParams();
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
        <UserDefinedFieldsForm
          data={props.item.user_defined}
          defineableId={projectModelRelationshipId}
          defineableType='CoreDataConnector::ProjectModelRelationship'
          isError={props.isError}
          onChange={(userDefined) => props.onSetState({ user_defined: userDefined })}
          onClearValidationError={props.onClearValidationError}
          tableName='CoreDataConnector::Relationship'
        />
      </SimpleEditPage.Tab>
    </SimpleEditPage>
  );
};

const RelatedMediaContent = withRelationshipEditPage(RelatedMediaContentForm);
export default RelatedMediaContent;
