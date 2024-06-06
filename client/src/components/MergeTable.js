// @flow

import cx from 'classnames';
import React, { type Element } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Header, Table } from 'semantic-ui-react';
import _ from 'underscore';
import MergeAttribute from './MergeAttribute';
import styles from './MergeTable.module.css';

type Attribute = {
  editable?: boolean,
  label: string,
  name: string
};

type Props = {
  attributes: Array<Attribute>,
  item: any,
  items: Array<any>,
  label: string,
  onAttributeSelection: () => void,
  onClear: () => void,
  onClearAttribute: () => void,
  onSelect: (item: any) => void,
  renderValue: (item: any, attribute: Attribute, editable: boolean) => Element | string
};

const MergeTable = (props: Props) => {
  const { t } = useTranslation();

  return (
    <div
      className={styles.mergeTable}
    >
      <Table
        celled
        padded
        verticalAlign='top'
        size='small'
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <Header
                className={cx(styles.ui, styles.header)}
                content={t('MergeTable.labels.attributes')}
                size='tiny'
              />
            </Table.HeaderCell>
            <Table.HeaderCell>
              <div
                className={styles.mergeHeader}
              >
                <Header
                  className={cx(styles.ui, styles.header)}
                  content={props.label}
                  size='tiny'
                />
                { props.onClear && (
                  <Button
                    basic
                    className={cx(
                      styles.ui,
                      styles.button,
                      styles.listButton
                    )}
                    compact
                    icon='times'
                    onClick={props.onClear}
                  />
                )}
              </div>
            </Table.HeaderCell
            >
            { _.map(props.items, (item, index) => (
              <Table.HeaderCell
                key={index}
              >
                <div
                  className={cx(styles.recordHeader)}
                >
                  { props.onSelect && (
                    <Button
                      basic
                      className={cx(
                        styles.ui,
                        styles.button,
                        styles.listButton
                      )}
                      compact
                      icon='arrow left'
                      onClick={() => props.onSelect(item)}
                    />
                  )}
                  <Header
                    className={cx(styles.ui, styles.header)}
                    content={item.label}
                    size='tiny'
                  />
                </div>
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { _.map(props.attributes, (attribute, index) => (
            <Table.Row
              key={index}
            >
              <Table.Cell
                verticalAlign='top'
              >
                { attribute.label }
              </Table.Cell>
              <Table.Cell
                verticalAlign='top'
              >
                <MergeAttribute
                  button={attribute.editable !== false && {
                    basic: true,
                    className: cx(
                      styles.ui,
                      styles.button,
                      styles.listButton
                    ),
                    compact: true,
                    icon: 'times',
                    onClick: () => props.onClearAttribute(attribute)
                  }}
                  buttonPosition='right'
                  className={cx(styles.attributeValue, styles.selected)}
                  value={props.renderValue(props.item, attribute, true)}
                />
              </Table.Cell>
              { _.map(props.items, (item, idx) => (
                <Table.Cell
                  key={idx}
                  verticalAlign='top'
                >
                  <MergeAttribute
                    button={attribute.editable !== false && {
                      basic: true,
                      className: cx(
                        styles.ui,
                        styles.button,
                        styles.listButton
                      ),
                      compact: true,
                      icon: 'arrow left',
                      onClick: () => props.onAttributeSelection(item, attribute)
                    }}
                    buttonPosition='left'
                    className={styles.attributeValue}
                    value={props.renderValue(item, attribute)}
                  />
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default MergeTable;
