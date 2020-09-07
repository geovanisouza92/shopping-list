import { H1, InputGroup, Spinner } from '@blueprintjs/core';
import React from 'react';
import styles from './Header.module.css';

export const Header = ({ onAddNewItem, isLoading }) => {
  const [value, setValue] = React.useState();

  return (
    <div>
      <div className={styles.header}>
        <H1>Shopping list</H1>
        {isLoading && (
          <Spinner
            intent="primary"
            size={25}
          />
        )}
      </div>
      <form onSubmit={e => {
        e.preventDefault();
        onAddNewItem(value);
        setValue('');
      }}>
        <InputGroup
          fill
          intent="primary"
          placeholder="Item"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      </form>
    </div>
  );
};
