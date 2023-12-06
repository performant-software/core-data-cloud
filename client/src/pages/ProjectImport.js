// @flow

import { FileUpload } from '@performant-software/semantic-components';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Header,
  List,
  Message
} from 'semantic-ui-react';
import _ from 'underscore';
import ProjectsService from '../services/Projects';
import styles from './ProjectImport.module.css';
import useParams from '../hooks/ParsedParams';

const TYPE_ZIP = 'application/zip';

const ProjectImport = () => {
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { projectId } = useParams();
  const { t } = useTranslation();

  /**
   * Validates the file type and sets the file on the state.
   *
   * @type {(function([*]): void)|*}
   */
  const onFilesAdded = useCallback(([f]) => {
    // Only a single zip file may be uploaded at a time
    if (f.type !== TYPE_ZIP) {
      setError({
        header: t('ProjectImport.errors.file.header'),
        content: t('ProjectImport.errors.file.content')
      });
      setFile(null);
    } else {
      setError(null);
      setFile(f);
    }
  }, []);

  /**
   * Sets the passed import error on the state.
   *
   * @type {(function({response: {data: {errors: *}}}): void)|*}
   */
  const onImportError = useCallback(({ response: { data: { errors } } }) => {
    let content;

    if (_.has(_.first(errors), 'base')) {
      content = _.first(errors)?.base;
    } else if (_.isString(_.first(errors))) {
      content = _.first(errors);
    }

    setError({
      content,
      header: t('ProjectImport.errors.import.header')
    });

    setFile(null);
  }, []);

  /**
   * Calls the /projects/:id/import API endpoint with the selected file.
   *
   * @type {(function(): void)|*}
   */
  const onUpload = useCallback(() => {
    setLoading(true);

    ProjectsService
      .import(projectId, file)
      .then(() => setSuccess(true))
      .catch(onImportError)
      .finally(() => setLoading(false));
  }, [file]);

  return (
    <div
      className={styles.projectImport}
    >
      <Header
        content={t('ProjectImport.title')}
      />
      { error && (
        <Message
          content={error.content}
          error
          header={error.header}
        />
      )}
      { !file && (
        <FileUpload
          onFilesAdded={onFilesAdded}
        />
      )}
      { file && !error && (
        <List
          className={styles.fileList}
          divided
          verticalAlign='middle'
        >
          <List.Item
            className={styles.listItem}
          >
            <List.Content
              className={styles.content}
            >
              <div>{ file.name }</div>
              <div>
                <Button
                  color={success ? 'green' : undefined}
                  icon={success ? 'checkmark' : 'cloud upload'}
                  loading={loading}
                  onClick={onUpload}
                />
                <Button
                  icon='times'
                  onClick={() => setFile(null)}
                />
              </div>
            </List.Content>
          </List.Item>
        </List>
      )}
    </div>
  );
};

export default ProjectImport;
