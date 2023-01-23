import { Dispatch, ReactNode } from "react";
import { Trainee } from "../../types/Trainee";

export type DataType = {
  trainees: Trainee[] | null;
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
  SET_TRAINEES
}