import { API, graphqlOperation } from 'aws-amplify';
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

export const Api = {
  async listItems() {
    const { data } = await API.graphql(graphqlOperation(listItems));
    return data?.listItems?.items ?? [];
  },
  async createItem({ name }) {
    const { data } = await API.graphql(graphqlOperation(createItem, {
      input: { name },
    }));
    return data?.createItem;
  },
  async updateItem({ id, name, done }) {
    const { data } = await API.graphql(graphqlOperation(updateItem, {
      input: { id, name, done },
    }));
    return data?.updateItem;
  },
  async deleteItem({ id }) {
    await API.graphql(graphqlOperation(deleteItem, {
      input: { id },
    }));
  },
};
