import { API, graphqlOperation } from 'aws-amplify';
import { queryCache, useMutation, useQuery } from 'react-query';
import { createItem, deleteItem, updateItem } from './graphql/mutations';
import { listItems } from './graphql/queries';

export const resumeApiError = (obj) => {
  if (typeof obj.errors !== 'object') {
    throw obj;
  }
  const errorMessages = obj.errors.reduce((logs, err) => {
    return logs.concat(`${err.errorType}: ${err.message}`);
  }, '');
  return errorMessages;
};

export const useQueries = () => {
  const { isError, error, data: items = [] } = useQuery('items', async () => {
    const { data } = await API.graphql(graphqlOperation(listItems));
    return data?.listItems?.items ?? [];
  });
  const setItems = (newItems) => queryCache.setQueryData('items', newItems);
  const [createItemMutation] = useMutation(async ({ name }) => {
    const { data } = await API.graphql(graphqlOperation(createItem, {
      input: { name },
    }));
    return data?.createItem;
  }, {
    onSuccess: (createdItem) => setItems(items.concat(createdItem)),
  });
  const [updateItemMutation] = useMutation(async ({ id, name, done }) => {
    const { data } = await API.graphql(graphqlOperation(updateItem, {
      input: { id, name, done },
    }));
    return data?.updateItem;
  }, {
    onSuccess(updatedItem) {
      const index = items.findIndex(item => item.id === updatedItem.id);
      if (index === -1) return;
      items.splice(index, 1, updatedItem);
      setItems(items);
    }
  });
  const [deleteItemMutation] = useMutation(async ({ id }) => {
    await API.graphql(graphqlOperation(deleteItem, {
      input: { id },
    }));
  }, {
    onSuccess: (_, { id }) => setItems(items.filter(item => item.id !== id)),
  });
  return {
    isError,
    error,
    items,
    setItems,
    createItem: createItemMutation,
    updateItem: updateItemMutation,
    deleteItem: deleteItemMutation,
  };
};
