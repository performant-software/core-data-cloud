// @flow

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import _ from 'underscore';
import useEditPage from './useEditPage';

type Config = {
  afterSave?: ((navigate: Function, item: any) => any) | string,
  id: string,
  onInitialize: (item: any) => Promise<any>,
  onSave: (item: any) => Promise<any>,
  required?: Array<string>,
  validate?: (item: any) => any
};

const ERROR_USER_DEFINED = 'user_defined';

const useReactRouterEditPage = (config: Config) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const { state } = location;
  const { saved: initialSavedState, tab: defaultTab } = state || {};

  const [saved, setSaved] = useState(initialSavedState);

  const timeoutRef = useRef();

  useEffect(() => {
    timeoutRef.current = setTimeout(() => setSaved(false), 1000);
    return () => clearTimeout(timeoutRef.current);
  }, [saved]);

  const { pathname } = location;
  const url = pathname.substring(0, pathname.lastIndexOf('/'));

  const id = params[config.id];

  /**
   * After save, navigate to the newly created record. We'll also add the "saved" attribute to indicate a message
   * should be displayed to the user.
   *
   * If an "afterSave" attribute is passed, determine where to navigate based on the attribute.
   */
  const afterSave = useCallback((item: any) => {
    if (config.afterSave && _.isFunction(config.afterSave)) {
      return config.afterSave(navigate, item);
    }

    setSaved(true);

    if (config.afterSave && _.isString(config.afterSave)) {
      return navigate(config.afterSave, { state: { saved: true } });
    }

    return navigate(`${url}/${item.id}`, { state: { saved: true } });
  }, [navigate, url, config.afterSave]);

  /**
   * Navigates to the previous route.
   */
  const onCancel = useCallback(() => navigate(-1), [navigate]);

  /**
   * Resolves the passed validation error.
   */
  const resolveValidationError = useCallback(({ key, error }) => {
    const errors = {};

    if (key === ERROR_USER_DEFINED) {
      const [uuid, message] = error;
      _.extend(errors, { [uuid]: message });
    } else {
      _.extend(errors, { [key]: error });
    }

    return errors;
  }, []);

  const editPageProps = useEditPage({
    ...config,
    afterSave,
    onCancel,
    id,
    defaultTab,
    resolveValidationError
  });

  return {
    ...editPageProps,
    saved
  };
};

export default useReactRouterEditPage;
