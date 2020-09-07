import React from 'react';
import { Api, showApiError } from './api';
import styles from './App.module.css';
import { Header } from './Header';
import { List } from './List';
import { useToaster } from './Toaster';

export const App = () => {
  const [isInitializing, setIsInitializing] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [showError] = useToaster();

  React.useEffect(() => {
    (async () => {
      const itemsListed = await Api.listItems();
      setItems(itemsListed);
      setIsInitializing(false);
    })();
  }, []);

  const handleAddNewItem = async (name) => {
    setIsLoading(true);
    try {
      const itemCreated = await Api.createItem({ name });
      setItems(items.concat(itemCreated));
    } catch (err) {
      showApiError(err, showError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleItem = async (id, done) => {
    const itemIndex = items.findIndex(it => it.id === id);
    if (itemIndex === -1) {
      return;
    }
    const { name } = items[itemIndex];
    setIsLoading(true);
    try {
      const updatedItem = await Api.updateItem({ id, name, done });
      setItems(items
        .slice(0, itemIndex)
        .concat(updatedItem)
        .concat(items.slice(itemIndex + 1))
      );
    } catch (err) {
      showApiError(err, showError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    setIsLoading(true);
    try {
      await Api.deleteItem({ id });
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      showApiError(err, showError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.app}>
      <Header
        onAddNewItem={handleAddNewItem}
        isLoading={isLoading}
      />
      <List
        items={items}
        onToggleItem={handleToggleItem}
        onDeleteItem={handleDeleteItem}
        isLoading={isInitializing}
      />
    </div>
  );
};
