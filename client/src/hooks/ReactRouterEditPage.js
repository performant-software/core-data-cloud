// @flow

import { withEditPage } from '@performant-software/shared-components';
import { type EditPageConfig } from '@performant-software/shared-components/types';
import React, { useCallback, type AbstractComponent } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import _ from 'underscore';

const ERROR_USER_DEFINED = 'user_defined';

const withReactRouterEditPage = (WrappedComponent: AbstractComponent<any>, config: EditPageConfig): any => (
  (props: any) => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const { pathname } = location;
    const url = pathname.substring(0, pathname.lastIndexOf('/'));

    const id = params[config.id];

    const { state } = location;
    const { saved, tab: defaultTab } = state || {};

    /**
     * After save, navigate to the newly created record. We'll also add the "saved" attribute to indicate a message
     * should be displayed to the user.
     *
     * @type {function(*, string): *}
     */
    const afterSave = useCallback((item: any) => (
      navigate(`${url}/${item.id}`, { state: { saved: true } })
    ), [navigate, url]);

    /**
     * Navigates to the previous route.
     *
     * @type {function(): *}
     */
    const onCancel = useCallback(() => navigate(-1), [navigate]);

    /**
     * Resolves the passed validation error.
     *
     * @type {function({key: *, error: *}): {}}
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

    const EditPage = withEditPage(WrappedComponent, {
      ...config,
      afterSave,
      onCancel,
      id,
      defaultTab,
      resolveValidationError,
      saved
    });

    return (
      <EditPage
        {...props}
        saved={saved}
      />
    );
  }
);

export default withReactRouterEditPage;
