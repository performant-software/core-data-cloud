// @flow

import { useState, useEffect, useCallback, useRef } from 'react';
import _ from 'underscore';
import i18n from '../i18n/i18n';
import { ObjectJs as ObjectUtils } from '@performant-software/shared-components';

type Options = {
  defaults?: any,
  item?: any,
  onClose: () => void,
  onInitialize?: (id: number) => Promise<any>,
  onSave: (item: any) => Promise<any>,
  required?: Array<string>,
  resolveValidationError?: ({ error: string, item: any, status: number, key: string }) => Array<string>,
  validate?: (item: any) => Array<string>
};

const ERROR_EMPTY = 'can\'t be blank';
const ERROR_UNIQUE = 'has already been taken';

const useEditContainer = (options: Options) => {
  const {
    defaults,
    item: itemProp,
    onClose,
    onInitialize,
    onSave: onSaveProp,
    required,
    resolveValidationError,
    validate
  } = options;

  const initialItem = _.defaults(itemProp || {}, defaults || {});

  const [item, setItem] = useState(initialItem);
  const [originalItem, setOriginalItem] = useState(initialItem);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const mountedRef = useRef(true);

  useEffect(() => {
    if (onInitialize && itemProp && itemProp.id) {
      setLoading(true);
      onInitialize(itemProp.id).then((loaded) => {
        if (mountedRef.current) {
          setItem(loaded);
          setOriginalItem(loaded);
          setLoading(false);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (itemProp) {
      setItem(itemProp);
      setOriginalItem(itemProp);
    }
  }, [itemProp]);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  const isChild = useCallback((a, b) => (
    (a.uid && b.uid && a.uid === b.uid) || (a.id && b.id && a.id === b.id)
  ), []);

  const isRequired = useCallback((prop: string) => (
    required && _.contains(required, prop)
  ), [required]);

  const isError = useCallback((prop: string) => (
    _.has(validationErrors, prop)
  ), [validationErrors]);

  const onClearValidationError = useCallback((...keys: Array<string>) => {
    setValidationErrors((prev) => _.omit(prev, keys));
  }, []);

  const onMarkChildAssociationForDelete = useCallback((association: string, child: any) => {
    setItem((prev) => ({
      ...prev,
      [association]: _.map(prev[association] || [],
        (c) => (c.id === child.id ? { ...c, _destroy: true } : c))
    }));
  }, []);

  const onRemoveChildAssociation = useCallback((association: string, child: any) => {
    setItem((prev) => ({
      ...prev,
      [association]: _.filter(prev[association] || [],
        (c) => !(isChild(c, child) || ObjectUtils.isEqual(c, child)))
    }));
  }, [isChild]);

  const onDeleteChildAssociation = useCallback((association: string, child: any) => (
    child.id
      ? onMarkChildAssociationForDelete(association, child)
      : onRemoveChildAssociation(association, child)
  ), [onMarkChildAssociationForDelete, onRemoveChildAssociation]);

  const onSaveChildAssociation = useCallback((association: string, child: any) => {
    setItem((prev) => {
      const children = prev[association] || [];
      const exists = _.find(children, (c) => isChild(child, c));

      if (exists) {
        return {
          ...prev,
          [association]: _.map(children, (c) => (isChild(child, c) ? child : c))
        };
      }

      return {
        ...prev,
        [association]: [...children, child]
      };
    });
  }, [isChild]);

  const onMultiAddChildAssociations = useCallback((association: string, children: any) => {
    setItem((prev) => {
      let updated = { ...prev };
      const items = updated[association] || [];

      // Add new or update existing
      _.each(children, (child) => {
        const existing = _.find(updated[association] || [], (c) => isChild(child, c));
        if (existing) {
          updated = {
            ...updated,
            [association]: _.map(updated[association] || [], (c) => (isChild(child, c) ? child : c))
          };
        } else {
          updated = {
            ...updated,
            [association]: [...(updated[association] || []), child]
          };
        }
      });

      // Remove children that no longer exist
      const toRemove = _.filter(items, (i) => !_.find(children, (c) => isChild(i, c)));
      _.each(toRemove, (child) => {
        if (child.id) {
          updated = {
            ...updated,
            [association]: _.map(updated[association] || [],
              (c) => (c.id === child.id ? { ...c, _destroy: true } : c))
          };
        } else {
          updated = {
            ...updated,
            [association]: _.filter(updated[association] || [],
              (c) => !(isChild(c, child) || ObjectUtils.isEqual(c, child)))
          };
        }
      });

      return updated;
    });
  }, [isChild]);

  const onError = useCallback(({ response: { data: { errors = {} }, status } }: any) => {
    const newErrors = {};

    _.each(Object.keys(errors), (key) => {
      const fieldErrors = errors[key];

      _.each(fieldErrors, (error) => {
        if (error === ERROR_UNIQUE) {
          _.extend(newErrors, { [key]: i18n.t('EditContainer.errors.unique', { key, value: item[key] }) });
        } else if (error === ERROR_EMPTY) {
          _.extend(newErrors, { [key]: i18n.t('EditContainer.errors.required', { key }) });
        } else if (resolveValidationError) {
          _.extend(newErrors, resolveValidationError({ key, error, status, item }));
        }
      });
    });

    if (status === 400 && _.isEmpty(newErrors)) {
      _.extend(newErrors, { error: i18n.t('EditContainer.errors.general') });
    } else if (status === 500 && _.isEmpty(newErrors)) {
      _.extend(newErrors, { error: i18n.t('EditContainer.errors.system') });
    }

    setSaving(false);
    setValidationErrors(newErrors);
  }, [item, resolveValidationError]);

  const validateForm = useCallback(() => {
    const errors = {};

    if (validate) {
      _.extend(errors, validate(item));
    }

    _.each(required || [], (key) => {
      const value = item[key];
      const invalid = _.isNumber(value)
        ? _.isEmpty(value.toString())
        : _.isEmpty(value);

      if (invalid) {
        _.extend(errors, { [key]: i18n.t('EditContainer.errors.required', { key }) });
      }
    });

    setValidationErrors(errors);
    return _.keys(errors).length === 0;
  }, [item, required, validate]);

  const onSave = useCallback(() => {
    if (!validateForm()) return;

    setSaving(true);
    onSaveProp(item)
      .catch(onError)
      .finally(() => {
        if (mountedRef.current) setSaving(false);
      });
  }, [item, onSaveProp, onError, validateForm]);

  const onJsonInputChange = useCallback((key: string, jsonKey: string, e: Event, { value }: any) => {
    setItem((prev) => ({
      ...prev,
      [key]: { ...prev[key], [jsonKey]: value }
    }));
    setValidationErrors((prev) => _.omit(prev, key));
  }, []);

  const onAssociationInputChange = useCallback((idKey: string, valueKey: string, record: any = {}) => {
    setItem((prev) => ({
      ...prev,
      [idKey]: record.id || '',
      [valueKey]: record || {}
    }));
    setValidationErrors((prev) => _.omit(prev, idKey));
  }, []);

  const onCheckboxInputChange = useCallback((key: string) => {
    setItem((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const onSetState = useCallback((props: any) => {
    setItem((prev) => ({ ...prev, ...props }));
    setValidationErrors((prev) => _.omit(prev, _.keys(props)));
  }, []);

  const onTextInputChange = useCallback((key: string, e: Event, { value }: any) => {
    setItem((prev) => ({ ...prev, [key]: value }));
    setValidationErrors((prev) => _.omit(prev, key));
  }, []);

  const onReset = useCallback(() => {
    const resetItem = defaults || {};
    setItem(resetItem);
    setOriginalItem(resetItem);
  }, [defaults]);

  return {
    dirty: !!(item.id && !ObjectUtils.isEqual(item, originalItem)),
    errors: _.values(validationErrors),
    isError,
    isRequired,
    item,
    loading,
    onAssociationInputChange,
    onCheckboxInputChange,
    onClearValidationError,
    onClose,
    onDeleteChildAssociation,
    onJsonInputChange,
    onMultiAddChildAssociations,
    onReset,
    onSave,
    onSaveChildAssociation,
    onSetState,
    onTextInputChange,
    saving
  };
};

export default useEditContainer;

export type EditContainerProps = {
  dirty: boolean,
  errors: Array<string>,
  isError: (property: string) => boolean,
  isRequired: (property: string) => boolean,
  item: any,
  loading: boolean,
  onAssociationInputChange: (idKey: string, valueKey: string, item: any) => void,
  onCheckboxInputChange: (key: string) => void,
  onClearValidationError: (...keys: Array<string>) => void,
  onClose: () => void,
  onJsonInputChange: (key: string, jsonKey: string, e: ?Event, value: any) => void,
  onDeleteChildAssociation: (association: string, child: any) => void,
  onMultiAddChildAssociations: (association: string, Array<any>) => void,
  onReset: () => void,
  onSave: () => void,
  onSaveChildAssociation: (association: string, child: any) => void,
  onSetState: (any) => void,
  onTextInputChange: (key: string, e: ?Event, value: any) => void,
  saving: boolean
};
