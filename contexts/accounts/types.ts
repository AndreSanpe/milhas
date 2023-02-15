import { Dispatch, ReactNode } from "react";
import { Account } from "../../types/Account";

export type DataType = {
  accounts: Account[] | null;
}

export type ActionType = {
  type: Actions;
  payload?: any;
}

export type ContextType = {
  state: DataType;
  dispatch: Dispatch<ActionType>;
}

export type ProviderType = {
  children: ReactNode;
}

export enum Actions {
  SET_ACCOUNTS
}