// @flow

import { LazyIIIF, SimpleEditPage } from '@performant-software/semantic-components';
import { IIIF as IIIFUtils } from '@performant-software/shared-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button, Header } from 'semantic-ui-react';
import { initialize, useRelationship, withRelationshipEditPage } from '../hooks/Relationship';
import type { Relationship as RelationshipType } from '../types/Relationship';
import styles from './RelatedMediaContent.module.css';
import useParams from '../hooks/ParsedParams';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';

type Props = EditContainerProps & {
  item: RelationshipType
};

const RelatedMediaContentForm = (props: Props) => {
  const { projectModelRelationshipId } = useParams();
  const { projectModelRelationship } = useProjectModelRelationship();
  const { foreignObject } = useRelationship(props);
  const { t } = useTranslation();

  /**
   * Sets the manifest URL.
   *
   * @type {string|string|*}
   */
  const manifest = useMemo(() => (IIIFUtils.createManifestURL(foreignObject?.manifest)), [foreignObject?.manifest]);

  /**
   * Sets the required foreign keys on the state.
   */
  initialize(props);

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
            contentType={foreignObject?.content_type}
            downloadUrl={foreignObject?.content_download_url}
            manifest={manifest}
            preview={foreignObject?.content_preview_url}
            src={foreignObject?.content_url}
          >
            <Button
              as={Link}
              color='orange'
              content={t('Common.buttons.edit')}
              icon='edit'
              to={`${projectModelRelationship?.url}/${foreignObject?.id}`}
            />
          </LazyIIIF>
          <Header
            className={styles.header}
            content={foreignObject?.name}
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
