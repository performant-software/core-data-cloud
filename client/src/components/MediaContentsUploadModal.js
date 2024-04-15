// @flow

import { FileUploadModal } from '@performant-software/semantic-components';
import React, {
  useCallback,
  useEffect,
  useState
} from 'react';
import _ from 'underscore';
import MediaContentUploadForm from './MediaContentUploadForm';
import MediaContentsService from '../services/MediaContents';
import useProjectModelRelationship from '../hooks/ProjectModelRelationship';

type Props = {
  onClose: () => void,
  onSave: () => Promise<any>
};

const MediaContentsUploadModal = (props: Props) => {
  const { foreignProjectModelId } = useProjectModelRelationship();
  const [complete, setComplete] = useState(false);
  const [mediaContents, setMediaContents] = useState([]);

  /**
   * Stores the saved media content record on the state.
   *
   * @type {function({data: *}): void}
   */
  const afterSave = useCallback(({ data }) => (
    setMediaContents((prevMediaContents) => [...prevMediaContents, data.media_content])
  ), []);

  /**
   * Calls the onSave prop with the media contents when the upload has completed.
   */
  useEffect(() => {
    if (complete && !_.isEmpty(mediaContents) && props.onSave) {
      props.onSave(mediaContents);
    }
  }, [complete, mediaContents, props.onSave]);

  return (
    <FileUploadModal
      closeOnComplete={false}
      itemComponent={MediaContentUploadForm}
      onAddFile={(file) => ({
        project_model_id: foreignProjectModelId,
        name: file.name,
        content: file,
        content_url: URL.createObjectURL(file),
        content_type: file.type
      })}
      onClose={props.onClose}
      onComplete={() => setComplete(true)}
      onSave={(mediaContent) => (
        MediaContentsService
          .save(mediaContent)
          .then(afterSave)
      )}
      showPageLoader={false}
      strategy='single'
    />
  );
};

export default MediaContentsUploadModal;
