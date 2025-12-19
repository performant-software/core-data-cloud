// @flow

import { FileUploadModal } from '@performant-software/semantic-components';
import { UserDefinedFieldsService } from '@performant-software/user-defined-fields';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'underscore';
import MediaContentUploadForm from './MediaContentUploadForm';
import MediaContentsService from '../services/MediaContents';
import ProjectContext from '../context/Project';
import UserDefinedFieldsUtils from '../utils/UserDefinedFields';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';

type Props = {
  errors?: Array<string>,
  onClose: () => void,
  onSave: () => Promise<any>
};

const MediaContentsUploadModal = (props: Props) => {
  const [complete, setComplete] = useState(false);
  const [mediaContents, setMediaContents] = useState([]);

  const [loadingProjectModelFields, setLoadingProjectModelFields] = useState(false);
  const [projectModelFields, setProjectModelFields] = useState([]);

  const [loadingProjectModelRelationshipFields, setLoadingProjectModelRelationshipFields] = useState(false);
  const [projectModelRelationshipFields, setProjectModelRelationshipFields] = useState([]);

  const { project } = useContext(ProjectContext);
  const { foreignProjectModelId, projectModelRelationship } = useProjectModelRelationship();
  const { t } = useTranslation();

  /**
   * Stores the saved media content record on the state.
   *
   * @type {function({data: *}): void}
   */
  const afterSave = useCallback((newMediaContents, userDefined) => {
    setMediaContents(_.map(newMediaContents, (mediaContent, index) => ({
      mediaContent: {
        ...mediaContent,
        relationship_user_defined: userDefined[index]
      }
    })));
  }, []);

  /**
   * In order to enter user-defined fields on upload, we're going to store values for both the media_content record
   * and the relationships record in the same container. Here we'll separate the user-defined field values for the
   * media_content record from those of the relationships record.
   */
  const onSave = useCallback((records) => {
    const uuids = _.pluck(projectModelRelationshipFields, 'uuid');

    const payload  = [];
    const relationshipUserDefined = [];

    _.each(records, (mediaContent) => {
      // Pick out the user-defined fields to store on the relationship
      relationshipUserDefined.push(_.pick(mediaContent.user_defined, uuids));

      // Prepare the payload and pick out the user-defined fields to store on the media_contents
      payload.push({
        ...mediaContent,
        user_defined: _.omit(mediaContent.user_defined, uuids)
      });
    });

    return MediaContentsService
      .uploadAll(payload, project)
      .then(({ data }) => data.media_contents)
      .then((newMediaContents) => afterSave(newMediaContents, relationshipUserDefined));
  }, [afterSave, project, projectModelRelationshipFields]);

  /**
   * Customizes the validation to include user-defined field use cases.
   *
   * @type {function(*, *): *}
   */
  const onValidate = useCallback((item, key) => {
    let value;

    if (key.includes('user_defined') && item.user_defined) {
      const uuid = UserDefinedFieldsUtils.parseUuid(key);
      value = item.user_defined[uuid];
    } else {
      value = item[key];
    }

    let invalid;

    if (_.isNumber(value)) {
      invalid = _.isEmpty(value.toString());
    } else {
      invalid = _.isEmpty(value);
    }

    return invalid;
  }, []);

  /**
   * Sets the required fields for the current context.
   *
   * @type {{name: string}}
   */
  const required = useMemo(() => {
    const value = { name: t('MediaContentsUploadModal.labels.name') };

    _.each(projectModelFields, (field) => {
      _.extend(value, { [`user_defined[${field.uuid}]`]: field.column_name });
    });

    _.each(projectModelRelationshipFields, (field) => {
      _.extend(value, { [`user_defined[${field.uuid}]`]: field.column_name });
    });

    return value;
  }, [projectModelFields, projectModelRelationshipFields]);

  /**
   * Calls the onSave prop with the media contents when the upload has completed.
   */
  useEffect(() => {
    if (complete && !_.isEmpty(mediaContents) && props.onSave) {
      props.onSave(mediaContents);
    }
  }, [complete, mediaContents, props.onSave]);

  /**
   * Loads the project model user-defined fields.
   */
  useEffect(() => {
    setLoadingProjectModelFields(true);

    UserDefinedFieldsService
      .fetchAll({
        defineable_id: foreignProjectModelId,
        defineable_type: 'CoreDataConnector::ProjectModel',
        required: true
      })
      .then(({ data }) => setProjectModelFields(data.user_defined_fields))
      .finally(() => setLoadingProjectModelFields(false));
  }, [foreignProjectModelId]);

  /**
   * Loads the project model relationship user-defined fields.
   */
  useEffect(() => {
    setLoadingProjectModelRelationshipFields(true);

    UserDefinedFieldsService
      .fetchAll({
        defineable_id: projectModelRelationship.id,
        defineable_type: 'CoreDataConnector::ProjectModelRelationship',
        required: true
      })
      .then(({ data }) => setProjectModelRelationshipFields(data.user_defined_fields))
      .finally(() => setLoadingProjectModelRelationshipFields(false));
  }, [projectModelRelationship]);

  if (loadingProjectModelFields || loadingProjectModelRelationshipFields) {
    return null;
  }

  return (
    <FileUploadModal
      closeOnComplete={false}
      errors={props.errors}
      itemComponent={MediaContentUploadForm}
      itemComponentProps={{
        projectModelFields,
        projectModelRelationshipFields
      }}
      onAddFile={(file) => ({
        project_model_id: foreignProjectModelId,
        name: file.name,
        content: file,
        content_url: URL.createObjectURL(file),
        content_type: file.type
      })}
      onClose={props.onClose}
      onComplete={() => setComplete(true)}
      onSave={onSave}
      onValidate={onValidate}
      required={required}
      showPageLoader={false}
    />
  );
};

export default MediaContentsUploadModal;
