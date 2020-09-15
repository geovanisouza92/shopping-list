import { Button, Checkbox, ControlGroup, Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import FuzzySearch from 'fuzzy-search';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import styles from './List.module.scss';

const propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    done: PropTypes.bool,
  })).isRequired,
  filter: PropTypes.string,
  onToggleItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
};

const animationClasses = {
  appear: styles.itemAppear,
  appearActive: styles.itemAppearActive,
  appearDone: styles.itemAppearDone,
  enter: styles.itemEnter,
  enterActive: styles.itemEnterActive,
  enterDone: styles.itemEnterDone,
  exit: styles.itemExit,
  exitActive: styles.itemExitActive,
  exitDone: styles.itemExitDone,
};

export const List = ({ items, filter, onToggleItem, onDeleteItem }) => {
  const search = React.useMemo(() => {
    return new FuzzySearch(items, ['name'], {
      caseSensitive: false,
    });
  }, [items]);

  let filteredItems = items;
  if (filter) {
    filteredItems = search.search(filter);
  }

  return (
    <ul className={styles.list}>
      {filteredItems.map((item) => (
        <CSSTransition
          key={item.id}
          in={!item.isHidden}
          appear
          timeout={{
            appear: 500,
            enter: 500,
            exit: 300,
          }}
          classNames={animationClasses}
        >
          <ControlGroup>
            <Checkbox
              className={classNames(styles.checkbox, styles.root)}
              label={item.name}
              checked={item.done}
              onChange={e => onToggleItem(item.id, !item.done)}
              large
            />
            <Button
              minimal
              intent={Intent.DANGER}
              icon="delete"
              onClick={e => onDeleteItem(item)}
            />
          </ControlGroup>
        </CSSTransition>
      ))}
    </ul>
  );
};

List.propTypes = propTypes;
