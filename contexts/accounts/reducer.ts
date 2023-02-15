import { DataType, ActionType, Actions } from "./types"

export const reducer = (state: DataType, action: ActionType) => {
  switch(action.type) {
    case Actions.SET_ACCOUNTS:
      return { ...state, accounts: action.payload.accounts};
      break;
      default: return state;
  }
}