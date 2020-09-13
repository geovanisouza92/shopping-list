import { Classes } from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import { queryCache, useMutation, useQuery } from 'react-query';
import { Api, resumeApiError } from './api';
import styles from './App.module.scss';
import { Header } from './Header';
import { List } from './List';
import { useTheme } from './Theme';
import { useToaster } from './Toaster';

const byNameAsc = (a, z) => a.name.localeCompare(z.name);

const useHiddenMap = () => {
  const [hiddenMap, setHiddenMap] = React.useState(new Map());
  return {
    isHidden: (token) => hiddenMap.has(token),
    remember: (token) => setHiddenMap((prevMap) => {
      prevMap.set(token, true);
      return prevMap;
    }),
    forget: (token) => setHiddenMap((prevMap) => {
      prevMap.delete(token);
      return prevMap;
    }),
  }
};

export const App = () => {
  const { isError, error, data: items = [] } = useQuery('items', Api.listItems, {
    refetchOnWindowFocus: false,
  });
  const setItems = (newItems) => queryCache.setQueryData('items', newItems);
  const [createItem] = useMutation(Api.createItem, {
    onSuccess: (createdItem) => setItems(items.concat(createdItem)),
  });
  const [updateItem] = useMutation(Api.updateItem, {
    onSuccess(updatedItem) {
      const index = items.findIndex(item => item.id === updatedItem.id);
      if (index === -1) return;
      const newItems = items.slice(0, index)
        .concat(updatedItem)
        .concat(items.slice(index + 1));
      setItems(newItems);
    }
  });
  const [deleteItem] = useMutation(Api.deleteItem, {
    onSuccess: (_, { id }) => setItems(items.filter(item => item.id !== id)),
  });
  const { isHidden, remember, forget } = useHiddenMap();
  const { showError, showUndoableAction } = useToaster();
  const { useDarkTheme } = useTheme();

  if (isError) {
    showError(error.message);
    return null;
  }

  const handleAddNewItem = async (name) => {
    try {
      await createItem({ name });
    } catch (err) {
      showError(resumeApiError(err));
    }
  };

  const handleToggleItem = async (id, done) => {
    const itemIndex = items.findIndex(it => it.id === id);
    if (itemIndex === -1) {
      return;
    }
    const { name } = items[itemIndex];
    try {
      await updateItem({ id, name, done });
    } catch (err) {
      showError(resumeApiError(err));
    }
  };

  const handleDeleteItem = async (item) => {
    remember(item.id);
    setItems(items);
    showUndoableAction({
      message: `Item "${item.name}" apagado`,
      undoAction() {
        forget(item.id);
        setItems(items);
      },
      async doAction(didTimeoutExpire) {
        const shouldDelete = isHidden(item.id) || didTimeoutExpire;
        if (!shouldDelete) {
          return;
        }
        try {
          await deleteItem({ id: item.id });
          forget(item.id);
        } catch (err) {
          showError(resumeApiError(err));
        }
      },
    });
  };

  const sortedItems = items
    .map((item) => ({
      ...item,
      isHidden: isHidden(item.id),
    }))
    .sort(byNameAsc);

  return (
    <div className={classNames(styles.app, {
      [Classes.DARK]: useDarkTheme,
    })}>
      <Header
        onAddNewItem={handleAddNewItem}
      />
      <List
        items={sortedItems}
        onToggleItem={handleToggleItem}
        onDeleteItem={handleDeleteItem}
      />
    </div>
  );
};
