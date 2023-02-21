import { DataType, ActionType, Actions } from "./types"

export const reducer = (state: DataType, action: ActionType) => {
  switch(action.type) {
    case Actions.SET_INPUTBUY:
      return { ...state, inputsBuy: action.payload.inputsBuy};
      break;
      default: return state;
  }
}