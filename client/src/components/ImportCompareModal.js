// @flow

import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Table } from 'semantic-ui-react';
import _ from 'underscore';

type Attribute = {
  name: string,
  label: string
};

type Props = {
  attributes: Array<Attribute>,
  item: any,
  onClose: () => void,
  onSave: () => void
};

const ImportCompareModal = (props: Props) => {
  const [item, setItem] = useState(props.item.import);

  const { t } = useTranslation();

  /**
   * Clears the passed attribute from the current item.
   *
   * @type {function(*): void}
   */
  const onClear = useCallback((attribute) => setItem((prevItem) => ({
    ...prevItem,
    [attribute.name]: null
  })), []);

  /**
   * Calls the onSave prop with the item on the state.
   *
   * @type {function(): *}
   */
  const onSave = useCallback(() => props.onSave(item), [item, props.onSave]);

  /**
   * Updates the current item with the value of the passed attribute from the database item.
   *
   * @type {function(*): void}
   */
  const onUpdate = useCallback((attribute) => setItem((prevItem) => ({
    ...prevItem,
    [attribute.name]: props.item.db[attribute.name]
  })), [props.item]);

  return (
    <Modal
      centered={false}
      open
    >
      <Modal.Header
        content={'Compare'}
      />
      <Modal.Content>
        <Table
          celled
          size='small'
        >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                content={'Attributes'}
              />
              <Table.HeaderCell
                content={'Incoming Record'}
              />
              <Table.HeaderCell
                content={'Existing Record'}
              />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { _.map(props.attributes, (attribute) => (
              <Table.Row>
                <Table.Cell>
                  { attribute.label }
                </Table.Cell>
                <Table.Cell>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>
                      { item[attribute.name] }
                    </span>
                    <Button.Group>
                      <Button
                        basic
                        compact
                        icon='times'
                        onClick={() => onClear(attribute)}
                      />
                    </Button.Group>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Button.Group>
                      <Button
                        basic
                        compact
                        icon='arrow left'
                        onClick={() => onUpdate(attribute)}
                      />
                    </Button.Group>
                    <span>
                      { props.item.db[attribute.name] }
                    </span>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content={t('Common.buttons.cancel')}
          onClick={props.onClose}
        />
        <Button
          content={t('Common.buttons.save')}
          onClick={onSave}
          primary
        />
      </Modal.Actions>
    </Modal>
  );
};

export default ImportCompareModal;
