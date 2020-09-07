import React from 'react';
import { Classes, ControlGroup, Checkbox, Button, Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import styles from './List.module.css';

export const List = ({ items, onToggleItem, onDeleteItem, isLoading }) => (
  <ul className={styles.list}>
    {items.map(item => (
      <ControlGroup key={`item-${item.id}`}>
        <Checkbox
          className={classNames(styles.checkbox, {
            [Classes.SKELETON]: isLoading,
          })}
          label={item.name}
          checked={item.done}
          onChange={e => onToggleItem(item.id, !item.done)}
          large
        />
        <Button
          minimal
          disabled={isLoading}
          intent={Intent.DANGER}
          icon="delete"
          onClick={e => onDeleteItem(item.id)}
        />
      </ControlGroup>
    ))}
  </ul>
);
