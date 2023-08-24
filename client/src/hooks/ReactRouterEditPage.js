// @flow

import { withEditPage } from '@performant-software/shared-components';
import { type EditPageConfig } from '@performant-software/shared-components/types';
import React, { useCallback, type AbstractComponent } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

type Config = Omit<EditPageConfig, 'onCancel'>;

const withReactRouterEditPage = (WrappedComponent: AbstractComponent<any>, config: Config): AbstractComponent<any> => (
  (props) => {
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
    const afterSave = useCallback((item: any, tab: string) => (
      navigate(`${url}/${item.id}`, { state: { saved: true, tab } })
    ), [navigate, url]);

    /**
     * Navigates to the previous route.
     *
     * @type {function(): *}
     */
    const onCancel = useCallback(() => navigate(-1), [navigate]);

    const EditPage = withEditPage(WrappedComponent, {
      ...config,
      afterSave,
      onCancel,
      id,
      defaultTab,
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
