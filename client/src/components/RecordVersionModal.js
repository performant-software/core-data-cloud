// @flow

import { Dialog } from '@base-ui/react/dialog';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'underscore';
import UserDefinedFieldValue from './UserDefinedFieldValue';
import type { Version } from '../types/Version';

type Props = {
  onClose: () => void,
  version: Version
};

const RecordVersionModal = (props: Props) => {
  const { t } = useTranslation();

  /**
   * Formats a raw attribute value for display.
   *
   * @param value
   *
   * @returns {string}
   */
  const formatValue = useCallback((value: any) => {
    if (_.isBoolean(value)) {
      return value ? t('Common.values.yes') : t('Common.values.no');
    }

    if (_.isArray(value)) {
      return value.join(', ');
    }

    if (_.isObject(value)) {
      return JSON.stringify(value);
    }

    if (_.isNull(value) || _.isUndefined(value) || value === '') {
      return null;
    }

    return String(value);
  }, [t]);

  /**
   * Combines the version's standard attribute changes and user-defined field changes into a single list.
   */
  const changes = useMemo(() => ([
    ..._.map(props.version?.attributes, (change, name) => ({
      key: name,
      label: t(`Common.fields.${name}`),
      from: formatValue(change.from),
      to: formatValue(change.to)
    })),
    ..._.map(props.version?.user_defined, (change) => ({
      key: change.uuid,
      label: change.label,
      from: <UserDefinedFieldValue editable={false} field={change} value={change.from} />,
      to: <UserDefinedFieldValue editable={false} field={change} value={change.to} />
    }))
  ]), [props.version]);

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) {
          props.onClose();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop
          className='fixed inset-0 bg-black/30 transition-opacity duration-150 data-ending-style:opacity-0'
        />
        <Dialog.Popup
          className='fixed top-1/2 left-1/2 flex max-h-[85vh] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg bg-white shadow-xl transition-all duration-150 data-ending-style:scale-95 data-ending-style:opacity-0'
        >
          <div className='flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-4'>
            <div>
              <Dialog.Title className='text-2xl font-semibold text-gray-900'>
                { t('RecordVersionModal.title') }
              </Dialog.Title>
              <Dialog.Description className='mt-1 text-gray-500'>
                {
                  t('RecordVersionModal.description', {
                    date: new Date(props.version?.created_at).toLocaleString(),
                    name: props.version?.root_display_name,
                    user: props.version?.user?.name
                  })
                }
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label={t('Common.buttons.close')}
              className='flex h-8 w-8 shrink-0 items-center justify-center rounded border-0 text-gray-400 hover:brightness-[0.95] hover:text-gray-600 focus-visible:outline-2 focus-visible:outline-gray-400 hover:cursor-pointer'
            >
              <svg
                fill='none'
                height='14'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                viewBox='0 0 14 14'
                width='14'
              >
                <path d='m1 1 12 12M13 1 1 13' />
              </svg>
            </Dialog.Close>
          </div>
          <div className='overflow-y-auto px-6 py-4'>
            <div className='grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1.5fr)] gap-x-4 gap-y-1'>
              <div className='px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                { t('RecordVersionModal.columns.field') }
              </div>
              <div className='rounded-t bg-red-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-red-700'>
                { t('RecordVersionModal.columns.from') }
              </div>
              <div className='rounded-t bg-green-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-green-700'>
                { t('RecordVersionModal.columns.to') }
              </div>
              {
                _.map(changes, (change) => (
                  <React.Fragment key={change.key}>
                    <div className='self-center px-3 py-2 text-sm font-medium text-gray-700'>
                      { change.label }
                    </div>
                    <div className='self-stretch wrap-break-word bg-red-50 px-3 py-2 text-sm text-red-900'>
                      { _.isEmpty(change.from) ? (
                        <span className='italic text-red-300'>
                          { t('RecordVersionModal.labels.empty') }
                        </span>
                      ) : change.from }
                    </div>
                    <div className='self-stretch wrap-break-word bg-green-50 px-3 py-2 text-sm text-green-900'>
                      { _.isEmpty(change.to) ? (
                        <span className='italic text-green-300'>
                          { t('RecordVersionModal.labels.empty') }
                        </span>
                      ) : change.to }
                    </div>
                  </React.Fragment>
                ))
              }
            </div>
          </div>
          <div className='flex justify-end border-t border-gray-200 px-6 py-4'>
            <Dialog.Close
              className='rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-gray-400 hover:cursor-pointer'
            >
              { t('Common.buttons.close') }
            </Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default RecordVersionModal;