import { H1, InputGroup, Spinner } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import React from 'react';
import { useIsFetching } from 'react-query';
import styles from './Header.module.scss';

const propTypes = {
  onAddNewItem: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export const Header = ({ onAddNewItem, onFilterChange }) => {
  const [value, setValue] = React.useState();
  const isFetching = useIsFetching();

  const handleValueChange = ({ target }) => {
    setValue(target.value);
    onFilterChange(target.value);
  };

  const handleAddNewItem = e => {
    e.preventDefault();
    onAddNewItem(value);
    setValue('');
    onFilterChange('');
  };

  return (
    <>
      <div className={styles.header}>
        <H1>Shopping list</H1>
        {isFetching ? (
          <Spinner
            intent="primary"
            size={25}
          />
        ) : null}
      </div>
      <form onSubmit={handleAddNewItem}>
        <InputGroup
          fill
          intent="primary"
          placeholder="Digite aqui"
          value={value}
          onChange={handleValueChange}
        />
      </form>
    </>
  );
};

Header.propTypes = propTypes;
