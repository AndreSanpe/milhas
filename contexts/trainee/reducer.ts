import { DataType, ActionType, Actions } from "./types"

export const reducer = (state: DataType, action: ActionType) => {
  switch(action.type) {
    case Actions.SET_TRAINEE:
      return { ...state, trainee: action.payload.trainee};
      break;
      default: return state;
  }
}