import { Intent, Position, Toaster } from '@blueprintjs/core';
import React from 'react';

const internalToaster = Toaster.create({
  position: Position.TOP,
  usePortal: true,
});

const ToasterContext = React.createContext(internalToaster);

export const ToasterProvider = ({ children }) => (
  <ToasterContext.Provider value={internalToaster}>
    {children}
  </ToasterContext.Provider>
);

export const useToaster = () => {
  const toaster = React.useContext(ToasterContext);

  const showError = (message) => {
    toaster.show({
      message,
      intent: Intent.DANGER,
    })
  };

  const showUndoableAction = ({ message, undoAction, doAction, timeout = 5000 }) => {
    toaster.show({
      message,
      intent: Intent.WARNING,
      action: {
        text: 'Desfazer',
        onClick: undoAction,
      },
      onDismiss: doAction,
      timeout,
    })
  };

  return { showError, showUndoableAction };
};
