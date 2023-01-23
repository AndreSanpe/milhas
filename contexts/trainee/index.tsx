import { reducer } from './reducer';
import { createContext, useReducer } from 'react';
import { ContextType, DataType, ProviderType } from './types';

export { useTraineeContext } from './hook';

const initialState: DataType = {
  trainee: null
}

export const AppContext = createContext<ContextType>({
  state: initialState,
  dispatch: () => {}
});

export const Provider = ({ children }: ProviderType) => {

  const [state, dispatch] = useReducer(reducer, initialState);

  const value = { state, dispatch };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}