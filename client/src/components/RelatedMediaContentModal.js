// @flow

import { LazyIIIF } from '@performant-software/semantic-components';
import { IIIF as IIIFUtils } from '@performant-software/shared-components';
import type { EditContainerProps } from '@performant-software/shared-components/types';
import { UserDefinedFieldsForm } from '@performant-software/user-defined-fields';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Modal } from 'semantic-ui-react';
import ProjectModelRelationshipContext from '../context/ProjectModelRelationship';
import type { Relationship as RelationshipType } from '../types/Relationship';
import { useRelationship } from '../hooks/Relationship';

type Props = EditContainerProps & {
  item: RelationshipType
};

const RelatedMediaContentModal = (props: Props) => {
  const { projectModelRelationship } = useContext(ProjectModelRelationshipContext);
  const { foreignObject, label: name } = useRelationship(props);
  const { t } = useTranslation();

  /**
   * Sets the manifest URL.
   *
   * @type {string|string|*}
   */
  const manifest = useMemo(() => (IIIFUtils.createManifestURL(foreignObject?.manifest)), [foreignObject?.manifest]);

  return (
    <Modal
      as={Form}
      centered={false}
      noValidate
      open
    >
      <Modal.Header
        content={props.item.id
          ? t('Common.labels.related.edit', { name })
          : t('Common.labels.related.add', { name })}
      />
      <Modal.Content>
        <Form.Input>
          <LazyIIIF
            color='teal'
            contentType={foreignObject?.content_type}
            downloadUrl={foreignObject?.content_download_url}
            manifest={manifest}
            preview={foreignObject?.content_preview_url}
            src={foreignObject?.content_url}
          />
        </Form.Input>
        { projectModelRelationship && (
          <UserDefinedFieldsForm
            data={props.item.user_defined}
            defineableId={projectModelRelationship.id}
            defineableType='CoreDataConnector::ProjectModelRelationship'
            isError={props.isError}
            onChange={(userDefined) => props.onSetState({ user_defined: userDefined })}
            onClearValidationError={props.onClearValidationError}
            tableName='CoreDataConnector::Relationship'
          />
        )}
      </Modal.Content>
      { props.children }
    </Modal>
  );
};

export default RelatedMediaContentModal;
