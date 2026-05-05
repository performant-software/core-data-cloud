// @flow

import { useCallback, useMemo, useRef } from 'react';
import _ from 'underscore';
import i18n from '../i18n/i18n';
import useEditContainer from './useEditContainer';

type Config = {
  afterSave?: (item: any, tab: string) => Promise<any>,
  id: string,
  onCancel: () => void,
  onInitialize: (item: any) => Promise<any>,
  onSave: (item: any) => Promise<any>,
  required?: Array<string>,
  resolveValidationError?: (params: any) => any,
  validate?: (item: any) => any
};

const useEditPage = (config: Config) => {
  const { id } = config;
  const tabRef = useRef();

  /**
   * Adds the authorization error.
   */
  const resolveValidationError = useCallback((errorProps) => {
    const errors = {};

    if (config.resolveValidationError) {
      _.extend(errors, config.resolveValidationError(errorProps));
    }

    if (errorProps.status === 403) {
      _.extend(errors, { base: i18n.t('Common.errors.unauthorized') });
    }

    return errors;
  }, [config.resolveValidationError]);

  /**
   * Saves the passed item then calls the "afterSave" prop.
   */
  const onSave = useCallback((item) => (
    config
      .onSave(item)
      .then((record) => config.afterSave && config.afterSave(record, tabRef.current))
  ), [config.afterSave, config.onSave]);

  const item = useMemo(() => ({ id }), [id]);

  const editProps = useEditContainer({
    item,
    onClose: config.onCancel,
    onInitialize: config.onInitialize,
    onSave,
    required: config.required,
    resolveValidationError,
    validate: config.validate
  });

  const onTabClick = useCallback((newTab) => {
    tabRef.current = newTab;
  }, []);

  return {
    ...editProps,
    onTabClick
  };
};

export default useEditPage;

export type {
  Config
};