import { Dispatch, ReactNode } from "react";
import { InputBuy } from "../../types/InputBuy";

export type DataType = {
  inputsBuy: InputBuy;
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
  SET_INPUTBUY
}