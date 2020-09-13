import { H1, InputGroup, Spinner } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import React from 'react';
import { useIsFetching } from 'react-query';
import styles from './Header.module.scss';

const propTypes = {
  onAddNewItem: PropTypes.func.isRequired,
};

export const Header = ({ onAddNewItem }) => {
  const [value, setValue] = React.useState();
  const isFetching = useIsFetching();

  return (
    <div>
      <div className={styles.header}>
        <H1>Shopping list</H1>
        {isFetching ? (
          <Spinner
            intent="primary"
            size={25}
          />
        ) : null}
      </div>
      <form onSubmit={e => {
        e.preventDefault();
        onAddNewItem(value);
        setValue('');
      }}>
        <InputGroup
          fill
          intent="primary"
          placeholder="Digite aqui"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      </form>
    </div>
  );
};

Header.propTypes = propTypes;
